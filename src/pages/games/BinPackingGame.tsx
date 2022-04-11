import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { IRect, Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import BinAlgorithm, { BinAlgorithmHandle } from '../../components/games/bin-packing/BinAlgorithm';
import BinInteractive from '../../components/games/bin-packing/BinInteractive';
import BinInventory from '../../components/games/bin-packing/BinInventory';
import { NAV_HEIGHT, PADDING, SCROLLBAR_HEIGHT, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, sidewaysScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useWindowSize } from '../../hooks/useWindowSize';
import { BinPackingAlgorithm } from '../../types/enums/BinPackingAlgorithm.enum';
import { ColorRect } from '../../types/ColorRect.interface';
import { generateInventory } from '../../utils/generateData';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { Dimensions } from '../../types/Dimensions.interface';
import { compressBinPackingInv, findBin, getLocalInteractiveX, isBin } from '../../utils/binPacking';
import { BinPackingRect } from '../../types/BinPackingRect.interface';
import BinPackingNav from '../../components/Nav/BinPackingNav';
import { useOnGameStart } from '../../hooks/useOnGameStart';
import { useRestartStripPacking } from '../../hooks/useRestartStripPacking';
import { useSnap } from '../../hooks/useSnap';
import { Group as KonvaGroup } from 'konva/lib/Group';
import { intersects } from '../../utils/intersects';
import { Bin } from '../../types/Bin.interface';
import TimeBar from '../../components/TimeBar';
import { useEvents } from '../../hooks/useEvents';
import useScoreStore from '../../store/score.store';
import GameEndModal from '../../components/gameEndModal/Modal';
import { useGameEnded } from '../../hooks/useGameEnded';
import BinPackingGameIntroModal from '../../components/games/bin-packing/BinPackingGameIntroModal';
import SidewaysScrollBar from '../../components/canvas/SidewaysScrollBar';
import { useSetSidewaysScrollbar } from '../../hooks/useSetSidewaysScrollbar';

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
  // algorithm scroll
  const algorithmScrollbarRef = useRef<KonvaRect>(null);
  const algorithmLayerRef = useRef<KonvaLayer>(null);

  // shared scroll
  const initialBinAreaWidth = binAreaWidth * 2;
  const [scrollableWidth, setScrollableWidth] = useState(initialBinAreaWidth);

  // algorithm handle
  const algorithmHandle = useRef<BinAlgorithmHandle>(null);
  const [staticInventory, setStaticInventory] = useState<BinPackingRect[]>(generateInventory(inventoryWidth, NUM_ITEMS));
  const algorithmStartY = binAreaHeight + PADDING;

  const { algorithm } = useOnGameStart<BinPackingAlgorithm>(Gamemodes.BIN_PACKING, BinPackingAlgorithm.HYBRID_FIRST_FIT);

  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in a bin, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<ColorRect[]>([]);
  const [bins, setBins] = useState<Bin>({});
  const [binLayout, setBinLayout] = useState<IRect[]>([]);

  /**
   * Reset when algorithm or level changes
   */
  const resetFuncs = [
    () => {
      const newInv = generateInventory<BinPackingRect>(inventoryWidth, NUM_ITEMS);
      setRenderInventory([...newInv]);
      setStaticInventory([...newInv]);
      setBins({});
    },
    algorithmHandle.current?.reset,
  ];
  useSetSidewaysScrollbar(scrollableWidth, interactiveLayer, binAreaWidth, inventoryWidth, interactiveScrollBarRef);
  useSetSidewaysScrollbar(scrollableWidth, algorithmLayerRef, binAreaWidth, inventoryWidth, algorithmScrollbarRef);

  useEffect(() => {
    const layer = interactiveLayer.current!;
    const oldX = layer.x();

    // TODO fix
    const minX = -(scrollableWidth - binAreaWidth) + inventoryWidth;
    const maxX = 0 + inventoryWidth;
    const availableWidth = binAreaWidth - PADDING * 2 - SCROLLBAR_HEIGHT;

    const x = Math.max(minX, Math.min(oldX, maxX));

    const vx = ((x - inventoryWidth) / (-scrollableWidth + binAreaWidth)) * availableWidth + PADDING;
    console.log({ vx });
    interactiveScrollBarRef.current?.x(vx + inventoryWidth);
  }, [scrollableWidth]);

  useEffect(() => {
    const numBins = Object.values(bins).length + 2;
    const binWidthSum = numBins * (binSize.width + 30) + 30;
    const newWidth = Math.max(binWidthSum, initialBinAreaWidth);
    setScrollableWidth(newWidth);
  }, [bins]);

  useRestartStripPacking(resetFuncs, algorithm, {});

  // Snapping
  const { snapBinInventory, snapBinInteractive } = useSnap({
    inventory: staticInventory,
    inventoryWidth: inventoryWidth,
    stripWidth: binAreaWidth,
    gameHeight,
    inventoryLayer,
    interactiveLayerRef: interactiveLayer,
    inventoryFilterFunc: (r, target) => {
      return r.name == target.name();
    },
    scrollableHeight: 0,
  });

  const { dispatchEventOnPlace } = useEvents();
  const setRectanglesLeft = useScoreStore(useCallback(({ setRectanglesLeft }) => setRectanglesLeft, []));
  const returnIfFinished = useGameEnded();
  useEffect(() => setRectanglesLeft(renderInventory.length), [renderInventory.length]);

  const handleDraggedToBin = (evt: Shape<ShapeConfig> | KonvaStage, startPos: Vector2d): boolean => {
    if (returnIfFinished()) return false;

    const { name, ...evtRect } = evt.getAttrs() as Dimensions & Vector2d & { name: string };
    const offset = interactiveLayer.current!.x();
    const dropPos = evt.getAbsolutePosition();
    const interactiveScrollOffset = interactiveLayer.current?.y()!;
    const inventoryScrollOffset = inventoryLayer.current?.y()!;
    // take the offset into account
    const relativeDropX = dropPos.x - offset;

    const binId = findBin(binLayout, { x: relativeDropX, y: dropPos.y }, evtRect);

    const rect = renderInventory.find(r => r.name === name);

    if (!rect || binId === -1) return false;

    const rectToPlace = {
      x: getLocalInteractiveX(inventoryWidth, evtRect.x),
      y: -interactiveScrollOffset + evtRect.y + inventoryScrollOffset,
      width: rect.width,
      height: rect.height,
    };

    const interactiveRects = interactiveLayer.current?.children;
    const intersectAny = interactiveRects?.some(ir => {
      const attrs = ir.getAttrs();

      if (attrs.id && isBin(attrs.id)) {
        return false;
      }

      return intersects(attrs, rectToPlace);
    });

    // Collosion dection
    if (intersectAny) {
      return false;
    }

    const { x, y } = dropPos;
    setBins(old => ({
      ...old,

      [binId]: (old[binId] ?? []).concat({ ...rect, x: relativeDropX + inventoryWidth, y }),
    }));

    const res = algorithmHandle.current?.next();
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
      onCompress: idx => algorithmHandle.current?.place(placedRect, idx),
    });

    dispatchEventOnPlace();

    return true;
  };

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
      sidewaysScrollHandler({
        activeArea: {
          minX: inventoryWidth,
          maxX: wWidth,
          minY: 0,
          maxY: binAreaHeight,
        },
        startX: inventoryWidth,
        visibleWidth: binAreaWidth,
        layerRef: interactiveLayer,
        scrollBarRef: interactiveScrollBarRef,
        scrollableWidth: scrollableWidth,
      }),
      // algorithm
      sidewaysScrollHandler({
        activeArea: {
          minX: inventoryWidth,
          maxX: wWidth,
          minY: binAreaHeight,
          maxY: binAreaHeight * 2,
        },
        startX: inventoryWidth,
        visibleWidth: binAreaWidth,
        layerRef: algorithmLayerRef,
        scrollBarRef: algorithmScrollbarRef,
        scrollableWidth: scrollableWidth,
      }),
    ],
  });

  return (
    <div className="w-full">
      <BinPackingNav />
      <GameEndModal />
      <BinPackingGameIntroModal />
      <TimeBar />
      <Stage onWheel={handleWheel} width={wWidth} height={gameHeight}>
        <Layer>
          {/* Algorithm BG */}
          <Rect fill="#444" x={inventoryWidth} y={binAreaHeight} width={binAreaWidth} height={binAreaHeight} />
          {/* Interactive BG */}
          <Rect fill="#666" x={inventoryWidth} width={binAreaWidth} height={binAreaHeight} />
        </Layer>
        <BinInteractive
          binSize={binSize}
          snap={(group, target) => snapBinInteractive(group, target, binLayout)}
          onBinLayout={setBinLayout}
          bins={bins}
          setBins={setBins}
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
          data={staticInventory}
          selectedAlgorithm={BinPackingAlgorithm.HYBRID_FIRST_FIT}
          binSize={binSize}
          ref={algorithmHandle}
          dimensions={{
            width: binAreaWidth,
            height: binAreaHeight,
          }}
          offset={{ x: inventoryWidth, y: binAreaHeight }}
        />
        <Layer>
          {/* Inventory BG */}
          <Rect fill="#555" x={0} width={inventoryWidth} height={gameHeight} />
        </Layer>
        <BinInventory
          ref={inventoryLayer}
          gameHeight={gameHeight}
          inventoryWidth={inventoryWidth}
          onDraggedToBin={handleDraggedToBin}
          renderInventory={renderInventory}
          staticInventory={staticInventory}
          snap={target => snapBinInventory(interactiveLayer.current?.children as KonvaGroup[], target, binLayout)}
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
          <SidewaysScrollBar
            key="interactive scroll bar"
            ref={interactiveScrollBarRef}
            scrollableWidth={scrollableWidth}
            y={binAreaHeight - PADDING - SCROLLBAR_WIDTH}
            x={inventoryWidth + PADDING}
            gameWidth={binAreaWidth}
            onXChanged={(newX: number) => interactiveLayer.current?.x(newX + inventoryWidth)}
          />
          <SidewaysScrollBar
            key="algo scroll bar"
            startPosition="left"
            ref={algorithmScrollbarRef}
            scrollableWidth={scrollableWidth}
            x={inventoryWidth + PADDING}
            y={binAreaHeight * 2 - PADDING - SCROLLBAR_WIDTH}
            gameWidth={binAreaWidth}
            onXChanged={newX => algorithmLayerRef.current?.x(newX + inventoryWidth)}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default BinPackingGame;
