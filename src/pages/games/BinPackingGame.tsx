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
  const [staticInventory, setStaticInventory] = useState(generateInventory(inventoryWidth, NUM_ITEMS));
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

  const findBin = (pos: Vector2d) => {
    return binLayout.findIndex(({ height, width, x, y }) => {
      const rectX = pos.x - inventoryWidth;
      const fitsX = rectX > x && rectX < x + width;
      const fitsY = pos.y > y && pos.y < y + height;
      return fitsX && fitsY;
    });
  };

  const handleDraggedToBin = (name: string, pos: Vector2d) => {
    const offset = interactiveLayer.current!.y();
    // take the offset into account
    pos.y -= offset;

    const bin = findBin(pos);
    const { x, y } = pos;
    const rect = renderInventory.find(r => r.name === name);
    if (!rect) return;
    setBins(old => ({
      ...old,
      [bin]: (old[bin] ?? []).concat({ ...rect, x, y }),
    }));
    setRenderInventory(old => old.filter(r => r.name !== name));
    algorithm.current?.place();
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
