import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { IRect, Vector2d } from 'konva/lib/types';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import BinAlgorithm, { BinAlgorithmHandle } from '../../components/games/bin-packing/BinAlgorithm';
import BinInteractive from '../../components/games/bin-packing/BinInteractive';
import BinInventory from '../../components/games/bin-packing/BinInventory';
import { NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useWindowSize } from '../../hooks/useWindowSize';
import { BinPackingAlgorithms } from '../../types/BinPackingAlgorithm.interface';
import { ColorRect } from '../../types/ColorRect.interface';
import { generateInventory } from '../../utils/generateData';
import { Gamemodes } from '../../types/Gamemodes.enum';
import useGameStore from '../../store/game.store';
import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { Dimensions } from '../../types/Dimensions.interface';
import { compressBinPackingInv } from '../../utils/binPacking';
import { BinPackingRect } from '../../types/BinPackingRect.interface';

interface BinPackingGameProps {}
const NUM_ITEMS = 10;
// bin dimensions
const binSize = {
  height: 300,
  width: 400,
};
const BinPackingGame: React.FC<BinPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const gameHeight = wHeight - NAV_HEIGHT;
  const inventoryWidth = wWidth * 0.4;
  const binAreaWidth = wWidth - inventoryWidth;
  const binAreaHeight = gameHeight / 2;
  // inventory scroll
  const inventoryScrollBarRef = useRef<KonvaRect>(null);
  const inventoryLayer = useRef<KonvaLayer>(null);
  const inventoryScrollableHeight = gameHeight * 1.5;
  // interactive scroll
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveLayer = useRef<KonvaLayer>(null);
  const interactiveScrollableHeight = binAreaHeight * 2;
  // algorithm scroll
  const algorithmScrollbarRef = useRef<KonvaRect>(null);
  const algorithmLayerRef = useRef<KonvaLayer>(null);
  const algorithmScrollableHeight = binAreaHeight * 2;

  // algorithm handle
  const algorithm = useRef<BinAlgorithmHandle>(null);
  const [staticInventory, setStaticInventory] = useState<BinPackingRect[]>(generateInventory(inventoryWidth, NUM_ITEMS));
  const [inventoryChanged, setInventoryChanged] = useState(true);
  const { setCurrentGame } = useGameStore();
  const algorithmStartY = binAreaHeight + PADDING;

  useEffect(() => setCurrentGame(Gamemodes.BIN_PACKING), []);

  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in a bin, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<ColorRect[]>([]);
  const [bins, setBins] = useState<Record<number, ColorRect[]>>({});
  const [binLayout, setBinLayout] = useState<IRect[]>([]);

  const findBin = (dropPos: Vector2d, rect: Dimensions & Vector2d) => {
    return binLayout.findIndex(({ height: binHeight, width: binWidth, x: binX, y: binY }) => {
      // Check if the drop position is within the bin
      const binX2 = binX + binWidth;
      const binY2 = binY + binHeight;
      const rectX = dropPos.x;
      const rectY = dropPos.y;
      const rectX2 = dropPos.x + rect.width;
      const rectY2 = dropPos.y + rect.height;

      const fitsX1 = rectX >= binX;
      const fitsX2 = rectX2 <= binX2;
      const fitsY1 = rectY >= binY;
      const fitsY2 = rectY2 <= binY2;

      return fitsX1 && fitsX2 && fitsY1 && fitsY2;
    });
  };

  const handleDraggedToBin = (evt: Shape<ShapeConfig> | KonvaStage, startPos: Vector2d) => {
    const { name, ...evtRect } = evt.getAttrs() as Dimensions & Vector2d & { name: string };
    const offset = interactiveLayer.current!.y();
    const dropPos = evt.getAbsolutePosition();
    // take the offset into account
    dropPos.y -= offset;

    const bin = findBin({ x: dropPos.x - inventoryWidth, y: dropPos.y }, evtRect);

    // Animate it back
    if (bin === -1) {
      return new Konva.Tween({
        x: startPos.x,
        y: startPos.y,
        node: evt,
        duration: 0.4,
        easing: Konva.Easings.EaseOut,
      }).play();
    }

    const rect = renderInventory.find(r => r.name === name);

    if (!rect) return;

    const { x, y } = dropPos;
    setBins(old => ({
      ...old,
      [bin]: (old[bin] ?? []).concat({ ...rect, x, y }),
    }));
    // setRenderInventory(old => old.filter(r => r.name !== name));

    const res = algorithm.current?.next();
    if (!res) return false;
    const [placedRect, order, recIdx] = res;

    //  compress inventory
    compressBinPackingInv({
      placedRectIdx: recIdx,
      order,
      rectName: rect.name,
      inventoryWidth,
      placedRectName: placedRect.name,
      staticInventory,
      setStaticInventory: rects => setStaticInventory(rects),
      setRenderInventory: rects => setRenderInventory(rects),
      onCompress: idx => algorithm.current?.place(placedRect, idx),
    });
  };

  useEffect(() => {
    if (inventoryChanged) {
      setRenderInventory([...staticInventory]);
      setInventoryChanged(false);
      // setRectanglesLeft(0);
    }
  }, [staticInventory, inventoryChanged]);

  const handleWheel = useKonvaWheelHandler({
    handlers: [
      // inventory
      defaultScrollHandler({
        activeArea: {
          minX: 0,
          maxX: inventoryWidth,
        },
        visibleHeight: gameHeight,
        layerRef: inventoryLayer,
        scrollBarRef: inventoryScrollBarRef,
        scrollableHeight: inventoryScrollableHeight,
      }),
      // interactive
      defaultScrollHandler({
        activeArea: {
          minX: inventoryWidth,
          maxX: wWidth,
          minY: 0,
          maxY: binAreaHeight,
        },
        visibleHeight: binAreaHeight,
        layerRef: interactiveLayer,
        scrollBarRef: interactiveScrollBarRef,
        scrollableHeight: interactiveScrollableHeight,
      }),
      // algorithm
      defaultScrollHandler({
        activeArea: {
          minX: inventoryWidth,
          maxX: wWidth,
          minY: binAreaHeight,
          maxY: binAreaHeight * 2,
        },
        startY: algorithmStartY,
        visibleHeight: binAreaHeight,
        layerRef: algorithmLayerRef,
        scrollBarRef: algorithmScrollbarRef,
        scrollableHeight: algorithmScrollableHeight,
      }),
    ],
  });

  return (
    <div className="w-full">
      <Stage onWheel={handleWheel} width={wWidth} height={gameHeight}>
        <Layer>
          {/* Inventory BG */}
          <Rect fill="#555" x={0} width={inventoryWidth} height={gameHeight} />
          {/* Interactive BG */}
          <Rect fill="#666" x={inventoryWidth} width={binAreaWidth} height={binAreaHeight} />
          {/* Algorithm BG */}
          <Rect fill="#444" x={inventoryWidth} y={binAreaHeight} width={binAreaWidth} height={binAreaHeight} />
        </Layer>
        <BinInteractive
          binSize={binSize}
          onBinLayout={setBinLayout}
          bins={bins}
          ref={interactiveLayer}
          dimensions={{
            width: binAreaWidth,
            height: binAreaHeight,
          }}
          offset={{ x: inventoryWidth, y: 0 }}
        />

        <Layer>
          <Rect fill="#444" x={inventoryWidth} y={binAreaHeight} width={binAreaWidth} height={binAreaHeight} />
        </Layer>
        <BinAlgorithm
          layerRef={algorithmLayerRef}
          getInventoryScrollOffset={() => -inventoryLayer.current?.y()!}
          staticInventory={staticInventory}
          binLayout={binLayout}
          data={staticInventory}
          selectedAlgorithm={BinPackingAlgorithms.HYBRID_FIRST_FIT}
          binSize={binSize}
          ref={algorithm}
          dimensions={{
            width: binAreaWidth,
            height: binAreaHeight,
          }}
          offset={{ x: inventoryWidth, y: binAreaHeight }}
        />
        <BinInventory
          ref={inventoryLayer}
          gameHeight={gameHeight}
          inventoryWidth={inventoryWidth}
          onDraggedToBin={handleDraggedToBin}
          renderInventory={renderInventory}
          staticInventory={staticInventory}
        />

        <Layer>
          <ScrollBar
            key="inventory scroll bar"
            startPosition="top"
            ref={inventoryScrollBarRef}
            scrollableHeight={inventoryScrollableHeight}
            x={inventoryWidth - PADDING - SCROLLBAR_WIDTH}
            gameHeight={gameHeight}
            onYChanged={newY => inventoryLayer.current?.y(newY)}
          />
          <ScrollBar
            key="interactive scroll bar"
            startPosition="top"
            ref={interactiveScrollBarRef}
            scrollableHeight={interactiveScrollableHeight}
            x={inventoryWidth + binAreaWidth - PADDING - SCROLLBAR_WIDTH}
            gameHeight={binAreaHeight}
            onYChanged={newY => interactiveLayer.current?.y(newY)}
          />
          <ScrollBar
            key="algo scroll bar"
            startPosition="bottom"
            ref={algorithmScrollbarRef}
            scrollableHeight={algorithmScrollableHeight}
            x={inventoryWidth + binAreaWidth - PADDING - SCROLLBAR_WIDTH}
            y={algorithmStartY}
            gameHeight={binAreaHeight}
            onYChanged={newY => {
              algorithmLayerRef.current?.y(binAreaHeight - newY);
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default BinPackingGame;
