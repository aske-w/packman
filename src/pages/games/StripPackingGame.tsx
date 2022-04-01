import { Group } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import GameEndModal from '../../components/gameEndModal/Modal';
import Inventory from '../../components/games/stripPacking/Inventory';
import StripPackingAlgorithm, { StripPackingAlgorithmHandle } from '../../components/games/stripPacking/StripPackingAlgorithm';
import StripPackingGameIntroModal from '../../components/games/stripPacking/StripPackingGameIntroModal';
import StripPackingInteractive, { StripPackingInteractiveHandle } from '../../components/games/stripPacking/StripPackingInteractive';
import TimeBar from '../../components/TimeBar';
import { ALGO_MOVE_ANIMATION_DURATION, NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { useEvents } from '../../hooks/useEvents';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useRestartStripPacking } from '../../hooks/useRestartStripPacking';
import { useSnap } from '../../hooks/useSnap';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm.store';
import useGameStore from '../../store/game.store';
import useScoreStore from '../../store/score.store';
import { ColorRect } from '../../types/ColorRect.interface';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';
import { Rectangle } from '../../types/Rectangle.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';
import { pushItemToBack } from '../../utils/array';
import { compressInventory, generateInventory } from '../../utils/generateData';
import { intersects } from '../../utils/intersects';
import { sleep } from '../../utils/utils';

interface StripPackingGameProps {}
const NUM_ITEMS = 5;
const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.2;
  const inventoryWidth = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;
  const { setCurrentGame } = useGameStore();

  useEffect(() => setCurrentGame(Gamemodes.STRIP_PACKING), []);

  const algorithm = useAlgorithmStore(useCallback(({ algorithm }) => algorithm, []));
  const setRectanglesLeft = useScoreStore(useCallback(({ setRectanglesLeft }) => setRectanglesLeft, []));

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  /**
   * This is the immutable inventory, used for rendering the ghosts
   */
  const [startingInventory, setStartingInventory] = useState<ColorRect<RectangleConfig & { order?: number; removed?: boolean }>[]>(() => []);
  const [inventoryChanged, setInventoryChanged] = useState(true);

  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in the strip, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<ColorRect<RectangleConfig>[]>([]);

  const { onPlaceEvent, event } = useEvents(algorithm);

  useEffect(() => {
    if (inventoryChanged) {
      setRenderInventory([...startingInventory]);
      setInventoryChanged(false);
      setRectanglesLeft(0);
    }
  }, [startingInventory, inventoryChanged]);

  const scrollableHeight = gameHeight * 2;
  const algoRef = useRef<StripPackingAlgorithmHandle>(null);
  const interactiveRef = useRef<StripPackingInteractiveHandle>(null);
  // inventory scroll
  const inventoryScrollBarRef = useRef<KonvaRect>(null);
  const inventoryLayer = useRef<KonvaLayer>(null);
  // interactive scroll
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveLayerRef = useRef<KonvaLayer>(null);

  // Algo layer scroll
  const algorithmScrollbarRef = useRef<KonvaRect>(null);
  const algorithmLayerRef = useRef<KonvaLayer>(null);

  // Snapping
  const { snapInventory, snapInteractive } = useSnap<ColorRect<RectangleConfig & { order?: number; removed?: boolean }>>({
    inventory: startingInventory,
    inventoryWidth,
    stripWidth,
    gameHeight,
    inventoryLayer,
    interactiveLayerRef,
    inventoryFilterFunc: (r, target) => r.name == target.name(),
    scrollableHeight,
  });

  const resetFuncs = [
    () => setStartingInventory(generateInventory(inventoryWidth, NUM_ITEMS)),
    () => setInventoryChanged(true),
    interactiveRef.current?.reset,
    algoRef.current?.reset,
  ];

  useRestartStripPacking(resetFuncs, algorithm);

  const stripRectChangedCallback = () => {}; // TODO figure out if this is needed?

  /**
   * Pos is absolute position in the canvas
   */
  const onDraggedToStrip = (rectName: string, pos: Vector2d): boolean => {
    const rIdx = renderInventory.findIndex(r => r.name === rectName);

    if (rIdx !== -1) {
      const rect = renderInventory[rIdx];
      const interactiveScrollOffset = interactiveLayerRef.current?.y()!;
      const interactiveRects = interactiveLayerRef.current?.children;

      const rectToPlace: Rectangle = {
        x: pos.x,
        y: -interactiveScrollOffset + pos.y,
        width: rect.width,
        height: rect.height,
      };

      const intersectAny = interactiveRects?.some(ir => intersects(ir.getAttrs(), rectToPlace));

      if (intersectAny || rectToPlace.x < 0 || rectToPlace.x > stripWidth || rectToPlace.y < 0 || rectToPlace.y > scrollableHeight) return false;

      const placement = {
        x: pos.x,
        y: pos.y - gameHeight - interactiveScrollOffset,
      };

      interactiveRef.current?.place(rect, placement);
      const res = algoRef.current?.next();
      if (!res) return false;
      const [placedRect, order, recIdx] = res;
      const inv = [...startingInventory];
      const interactiveIdx = inv.findIndex(r => r.name === rectName);

      inv[interactiveIdx].removed = true;
      inv[recIdx].order = order;

      // Pushes currently placed block at the back of the inventory lust
      pushItemToBack(inv, interactiveIdx);

      let newRectIdx = 0;
      const compressedInv = compressInventory(inv, inventoryWidth, (rect, i) => rect.name === placedRect.name && (newRectIdx = i));

      const interactiveInventory = compressedInv.filter(r => !r.removed);
      setRenderInventory(interactiveInventory);
      setRectanglesLeft(renderInventory.length - 1);

      // give the order of placement to the starting state
      setStartingInventory(compressedInv);

      /**
       * Let inventory compress before animating
       */
      sleep(ALGO_MOVE_ANIMATION_DURATION * 500).then(() => {
        algoRef.current?.place(placedRect, newRectIdx);
      });
    }

    return true;
  };

  const handleWheel = useKonvaWheelHandler({
    handlers: [
      // inventory part
      defaultScrollHandler({
        activeArea: {
          minX: stripWidth,
          maxX: stripWidth + inventoryWidth,
        },
        visibleHeight: gameHeight,
        layerRef: inventoryLayer,
        scrollBarRef: inventoryScrollBarRef,
        scrollableHeight,
      }),
      // interactive part
      defaultScrollHandler({
        activeArea: {
          minX: 0,
          maxX: stripWidth,
        },
        visibleHeight: gameHeight,
        layerRef: interactiveLayerRef,
        scrollBarRef: interactiveScrollBarRef,
        scrollableHeight,
      }),
      defaultScrollHandler({
        activeArea: {
          minX: stripWidth + inventoryWidth,
          maxX: stripWidth * 2 + inventoryWidth,
        },
        visibleHeight: gameHeight,
        layerRef: algorithmLayerRef,
        scrollBarRef: algorithmScrollbarRef,
        scrollableHeight,
      }),
    ],
  });

  return (
    <div className="w-full ">
      <StripPackingGameIntroModal />
      <TimeBar />
      <GameEndModal />
      <div className="flex items-center justify-between w-full">
        <Stage onWheel={handleWheel} width={window.innerWidth} height={gameHeight}>
          <Layer>
            {/* Strip canvas */}
            <Rect fill="#555" x={0} width={stripWidth} height={gameHeight} />
            {/* Inventory */}
            <Rect fill="#333" x={stripWidth} width={inventoryWidth} height={gameHeight} />
            {/* Algorithm canvas */}
            <Rect fill="#555" x={inventoryWidth + stripWidth} width={stripWidth} height={gameHeight} />
            <ScrollBar
              startPosition="top"
              ref={inventoryScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth + inventoryWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => inventoryLayer.current?.y(newY)}
            />
            <ScrollBar
              startPosition="bottom"
              ref={interactiveScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => {
                interactiveLayerRef.current?.y(newY);
              }}
            />
            <ScrollBar
              startPosition="bottom"
              ref={algorithmScrollbarRef}
              scrollableHeight={scrollableHeight}
              x={inventoryWidth + stripWidth * 2 - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => {
                algorithmLayerRef.current?.y(newY);
              }}
            />
          </Layer>
          <StripPackingInteractive
            scrollableHeight={scrollableHeight}
            ref={interactiveRef}
            layerRef={interactiveLayerRef}
            width={stripWidth}
            height={gameHeight}
            stripRects={stripRects}
            setStripRects={setStripRects}
            snap={snapInteractive}
            stripRectChangedCallback={stripRectChangedCallback}
            staticInvLength={startingInventory.length}
          />
          <Inventory
            ref={inventoryLayer}
            staticInventory={startingInventory}
            dynamicInventory={renderInventory}
            // onDragging={(target: Shape) => trySnapOrColission(, target, interactiveLayerRef.current?.y()!)}
            snap={(target: Shape) => snapInventory(interactiveLayerRef.current?.children as Group[], target)}
            stripRects={stripRects}
            {...{
              onDraggedToStrip,
              stripWidth: stripWidth,
              inventoryWidth: inventoryWidth,
              gameHeight,
            }}
          />

          <StripPackingAlgorithm
            getInventoryScrollOffset={() => -1 * inventoryLayer.current!.y()}
            ref={algoRef}
            inventoryWidth={inventoryWidth}
            x={inventoryWidth + stripWidth}
            width={stripWidth}
            height={gameHeight}
            inventory={startingInventory}
            algorithm={algorithm}
            layerRef={algorithmLayerRef}
          />
        </Stage>
      </div>
    </div>
  );
};

export default StripPackingGame;
