import { Group } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../../components/canvas/ScrollBar';
import GameEndModal from '../../../components/gameEndModal/Modal';
import Inventory from '../../../components/games/stripPacking/Inventory';
import StripPackingAlgorithm, { StripPackingAlgorithmHandle } from '../../../components/games/stripPacking/StripPackingAlgorithm';
import StripPackingGameIntroModal from '../../../components/games/stripPacking/StripPackingGameIntroModal';
import StripPackingInteractive, { StripPackingInteractiveHandle } from '../../../components/games/stripPacking/StripPackingInteractive';
import DesignInputNav from '../../../components/Nav/DesignInputNav';
import StripPackingNav from '../../../components/Nav/StripPackingNav';
import TimeBar from '../../../components/TimeBar';
import { ALGO_MOVE_ANIMATION_DURATION, NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../../config/canvasConfig';
import { useAutoPlace } from '../../../hooks/useAutoPlace';
import { useGameEnded } from '../../../hooks/useGameEnded';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../../hooks/useKonvaWheelHandler';
import { useOnGameStart } from '../../../hooks/useOnGameStart';
import { AlgoStates } from '../../../hooks/usePackingAlgorithms';
import { useRestartStripPacking } from '../../../hooks/useRestartStripPacking';
import { useSnap } from '../../../hooks/useSnap';
import { useWindowSize } from '../../../hooks/useWindowSize';
import useEventStore from '../../../store/event.store';
import useScoreStore from '../../../store/score.store';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { Events } from '../../../types/enums/Events.enum';
import { Gamemodes } from '../../../types/enums/Gamemodes.enum';
import { PackingAlgorithmEnum } from '../../../types/enums/OfflineStripPackingAlgorithm.enum';
import { Rectangle } from '../../../types/Rectangle.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { pushItemToBack } from '../../../utils/array';
import { compressInventory, generateInventory, generateInventoryFromDimensions } from '../../../utils/generateData';
import { intersects } from '../../../utils/intersects';
import { sleep } from '../../../utils/utils';

interface DesignStripOfflineGameProps {}
const NUM_ITEMS = 25;
const DesignStripOfflineGame: React.FC<DesignStripOfflineGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.3;
  const inventoryWidth = wWidth * 0.7;
  const gameHeight = wHeight - NAV_HEIGHT;

  const { algorithm } = useOnGameStart<PackingAlgorithmEnum>(Gamemodes.STRIP_PACKING, PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT);

  const setRectanglesLeft = useScoreStore(useCallback(({ setRectanglesLeft }) => setRectanglesLeft, []));

  const { setEvent } = useEventStore(useCallback(({ setEvent }) => ({ setEvent }), []));

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const [dims, setDims] = useState<Dimensions[]>([]);

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

  const returnIfFinished = useGameEnded();

  useEffect(() => {
    if (inventoryChanged) {
      setRenderInventory([...startingInventory]);
      setInventoryChanged(false);
      setRectanglesLeft(startingInventory.length);
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
    () => {
      const newInv = generateInventoryFromDimensions(inventoryWidth, dims);
      setStartingInventory(newInv);
    },
    () => setInventoryChanged(true),
    algoRef.current?.reset,
  ];

  useRestartStripPacking(resetFuncs, algorithm, {});

  const [state, setState] = useState<AlgoStates>("STOPPED")

  const onStart = () => setState("RUNNING")
  
  const place = () => {
    const res = algoRef.current?.next();
    if (!res) {
      setState("STOPPED")
      return;
    }
    const [placedRect, order, recIdx] = res;
    const inv = [...startingInventory];

    inv[recIdx].removed = true;
    inv[recIdx].order = order;

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
    sleep(ALGO_MOVE_ANIMATION_DURATION * 100).then(() => algoRef.current?.place(placedRect, newRectIdx));
  }

  const { updateSpeed } = useAutoPlace(state === "RUNNING", place, state)
  useEffect(() => updateSpeed(90),[])
  /**
   * Pos is absolute position in the canvas
   */
  const onDraggedToStrip = (rectName: string, pos: Vector2d): boolean => {
    if (returnIfFinished()) return false;
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
      sleep(ALGO_MOVE_ANIMATION_DURATION * 500).then(() => algoRef.current?.place(placedRect, newRectIdx));
    }

    return true;
  };

  const handleWheel = useKonvaWheelHandler({
    handlers: [
      // inventory part
      defaultScrollHandler({
        activeArea: {
          minX: 0,
          maxX: inventoryWidth,
        },
        visibleHeight: gameHeight,
        layerRef: inventoryLayer,
        scrollBarRef: inventoryScrollBarRef,
        scrollableHeight,
      }),
      // interactive part
      // defaultScrollHandler({
      //   activeArea: {
      //     minX: 0,
      //     maxX: stripWidth,
      //   },
      //   visibleHeight: gameHeight,
      //   layerRef: interactiveLayerRef,
      //   scrollBarRef: interactiveScrollBarRef,
      //   scrollableHeight,
      // }),
      defaultScrollHandler({
        activeArea: {
          minX: inventoryWidth,
          maxX: stripWidth + inventoryWidth,
        },
        visibleHeight: gameHeight,
        layerRef: algorithmLayerRef,
        scrollBarRef: algorithmScrollbarRef,
        scrollableHeight,
      }),
    ],
  });

  return (
    <div className="w-full h-full ">
      <DesignInputNav 
        start={onStart} 
        rects={startingInventory} 
        setRects={(ds => {setDims(ds); setEvent(Events.RESTART)})} 
        startDisabled={state === "RUNNING"} 
        inputDesignerDisabled={state === "RUNNING"}  
      />
      <StripPackingGameIntroModal />
      {/* <TimeBar /> */}
      <GameEndModal />
      <div className="flex items-center justify-between w-full">
        <Stage onWheel={handleWheel} width={window.innerWidth} height={gameHeight}>
          <Layer>
            {/* Strip canvas */}
            {/* <Rect fill="#555" x={0} width={stripWidth} height={gameHeight} /> */}
            {/* Inventory */}
            <Rect fill="#333" width={inventoryWidth} height={gameHeight} />
            {/* Algorithm canvas */}
            <Rect fill="#555" x={inventoryWidth} width={stripWidth} height={gameHeight} />
          </Layer>
          {/* <StripPackingInteractive
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
          /> */}
          <Inventory
            ref={inventoryLayer}
            staticInventory={startingInventory}
            dynamicInventory={renderInventory}
            // onDragging={(target: Shape) => trySnapOrColission(, target, interactiveLayerRef.current?.y()!)}
            snap={(target: Shape) => snapInventory(interactiveLayerRef.current?.children as Group[], target)}
            stripRects={stripRects}
            {...{
              onDraggedToStrip,
              stripWidth: 0,
              inventoryWidth: inventoryWidth,
              gameHeight,
            }}
          />

          <StripPackingAlgorithm
            getInventoryScrollOffset={() => -1 * inventoryLayer.current!.y()}
            ref={algoRef}
            inventoryWidth={inventoryWidth}
            x={inventoryWidth}
            width={stripWidth}
            height={gameHeight}
            inventory={startingInventory}
            algorithm={algorithm}
            layerRef={algorithmLayerRef}
          />
          <Layer>
            {/* Scrollbars are in this layer so they are drawn above the rectangles */}
            <ScrollBar
              startPosition="top"
              ref={inventoryScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={inventoryWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => inventoryLayer.current?.y(newY)}
            />
            {/* <ScrollBar
              startPosition="bottom"
              ref={interactiveScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => {
                interactiveLayerRef.current?.y(newY);
              }}
            /> */}
            <ScrollBar
              key="algo scrollbar"
              startPosition="bottom"
              ref={algorithmScrollbarRef}
              scrollableHeight={scrollableHeight}
              x={inventoryWidth + stripWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={newY => {
                algorithmLayerRef.current?.y(newY);
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DesignStripOfflineGame;
