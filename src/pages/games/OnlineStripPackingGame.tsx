import { Group as KonvaGroup } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import ScrollBar from '../../components/canvas/ScrollBar';
import GameEndModal from '../../components/gameEndModal/Modal';
import OnlineStripPackingAlgorithm, {
  OnlineStripPackingAlgorithmHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingAlgorithm';
import OnlineStripPackingInteractive, {
  OnlineStripPackingInteractiveHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingInteractive';
import OnlineStripPackingInventory from '../../components/games/onlineStripPacking/OnlineStripPackingInventory';
import OnlineStripPackingNav from '../../components/Nav/OnlineStripPackingNav';
import TimeBar from '../../components/TimeBar';
import { NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useOnGameStart } from '../../hooks/useOnGameStart';
import { useOnlineStripPackingInventory } from '../../hooks/useOnlineStripPackingInventory';
import { useRestartStripPacking } from '../../hooks/useRestartStripPacking';
import { useSnap } from '../../hooks/useSnap';
import { useWindowSize } from '../../hooks/useWindowSize';
import useScoreStore from '../../store/score.store';
import { ColorRect } from '../../types/ColorRect.interface';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';
import { OnlineStripPackingAlgorithmEnum } from '../../types/enums/OnlineStripPackingAlgorithm.enum';
import { Rectangle } from '../../types/Rectangle.interface';
import { intersects } from '../../utils/intersects';
interface OnlineStripPackingGameProps {}
const NUM_ITEMS = 5;

const OnlineStripPackingGame: React.FC<OnlineStripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const totalGameWidth = Math.min(wWidth, 1280);
  const gameHeight = wHeight - NAV_HEIGHT;
  const inventoryWidth = totalGameWidth * 0.3;
  const colWidth = (totalGameWidth - inventoryWidth) / 2;
  const scrollableHeight = gameHeight * 5;

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const placedRects = useMemo(() => stripRects.map(({ name }) => name), [stripRects]);
  const setRectanglesLeft = useScoreStore(useCallback(({ setRectanglesLeft }) => setRectanglesLeft, []));
  const { visibleInventory, resetInventory, inventory } = useOnlineStripPackingInventory({
    inventoryWidth,
    inventoryHeight: gameHeight,
    placedRects,
    inventorySize: NUM_ITEMS,
  });

  useEffect(() => setRectanglesLeft(inventory.length - placedRects.length), [inventory, placedRects]);
  const { algorithm } = useOnGameStart<OnlineStripPackingAlgorithmEnum>(
    Gamemodes.ONLINE_STRIP_PACKING,
    OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF
  );

  /**
   * Number betweeen 0 and 1. Used in the FFS and NFS algorithms
   */
  const [r, setR] = useState(0.75);

  const interactiveLayerRef = useRef<KonvaLayer>(null);
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveHandle = useRef<OnlineStripPackingInteractiveHandle>(null);

  const inventoryLayerRef = useRef<KonvaLayer>(null);

  const algorithmLayerRef = useRef<KonvaLayer>(null);
  const algorithmScrollBarRef = useRef<KonvaRect>(null);
  const algorithmHandle = useRef<OnlineStripPackingAlgorithmHandle>(null);

  // Snapping
  const { snapInventory, snapInteractive } = useSnap({
    inventory: inventory,
    inventoryWidth,
    stripWidth: colWidth,
    gameHeight,
    inventoryLayer: inventoryLayerRef,
    interactiveLayerRef,
    inventoryFilterFunc: (r, target) => r.name == target.name(),
    scrollableHeight,
  });

  const resetFuncs = [() => setStripRects([]), resetInventory, interactiveHandle.current?.reset, algorithmHandle.current?.reset];

  const resetter = useRestartStripPacking(resetFuncs, algorithm, { r });

  /**
   * Pos is absolute position in the canvas
   */
  const onDraggedToStrip = async (rectName: string, pos: Vector2d): Promise<boolean> => {
    const rIdx = visibleInventory.findIndex(r => r.name === rectName);

    if (rIdx !== -1) {
      const rect = visibleInventory[rIdx];
      const interactiveScrollOffset = interactiveLayerRef.current?.y()!;
      const interactiveRects = interactiveLayerRef.current?.children;

      const rectToPlace: Rectangle = {
        x: pos.x,
        y: -interactiveScrollOffset + pos.y,
        width: rect.width,
        height: rect.height,
      };

      const intersectAny = interactiveRects?.some(ir => intersects(ir.getAttrs(), rectToPlace));

      if (intersectAny || rectToPlace.x < 0 || rectToPlace.x > colWidth || rectToPlace.y < 0 || rectToPlace.y > scrollableHeight) return false;

      const placement = {
        x: pos.x,
        y: pos.y - gameHeight - interactiveScrollOffset,
      };

      await algorithmHandle.current?.place(rect);
      interactiveHandle.current?.place(rect, placement);
    }

    return true;
  };

  const handleWheel = useKonvaWheelHandler({
    handlers: [
      // interactive
      defaultScrollHandler({
        activeArea: {
          minX: 0,
          maxX: colWidth,
        },
        visibleHeight: gameHeight,
        layerRef: interactiveLayerRef,
        scrollBarRef: interactiveScrollBarRef,
        scrollableHeight,
      }),
      // algorithm
      defaultScrollHandler({
        activeArea: {
          minX: colWidth + inventoryWidth,
          maxX: totalGameWidth,
        },
        visibleHeight: gameHeight,
        layerRef: algorithmLayerRef,
        scrollBarRef: algorithmScrollBarRef,
        scrollableHeight,
      }),
    ],
  });

  useEffect(() => {
    resetter();
  }, [r]);

  return (
    <div className="w-full h-full">
      <GameEndModal />
      <TimeBar />
      <OnlineStripPackingNav
        r={r}
        setR={_r => {
          setR(_r);
        }}
      />

      <Stage className="flex justify-center h-full max-w-screen-xl mx-auto " onWheel={handleWheel} width={totalGameWidth} height={gameHeight}>
        <Layer>
          {/* Interactive BG */}
          <Rect fill="#666" x={0} width={colWidth} height={gameHeight} />
          {/* Inventory BG */}
          <Rect fill="#555" x={colWidth} width={inventoryWidth} height={gameHeight} />
          {/* Algorithm BG */}
          <Rect fill="#444" x={colWidth + inventoryWidth} width={colWidth} height={gameHeight} />
        </Layer>

        <OnlineStripPackingInteractive
          scrollableHeight={scrollableHeight}
          ref={interactiveHandle}
          layerRef={interactiveLayerRef}
          width={colWidth}
          height={gameHeight}
          stripRects={stripRects}
          setStripRects={setStripRects}
          snap={snapInteractive}
          staticInvLength={inventory.length}
        />
        <OnlineStripPackingInventory
          entireInventory={inventory}
          onDraggedToStrip={onDraggedToStrip}
          snap={target => snapInventory(interactiveLayerRef.current?.children as KonvaGroup[], target)}
          ref={inventoryLayerRef}
          x={colWidth}
          visibleInventory={visibleInventory}
        />

        <OnlineStripPackingAlgorithm
          inventoryWidth={inventoryWidth}
          x={colWidth + inventoryWidth}
          layerRef={algorithmLayerRef}
          gameHeight={gameHeight}
          r={r}
          width={colWidth}
          ref={algorithmHandle}
          scrollableHeight={scrollableHeight}
          algorithm={algorithm}
        />

        <Layer>
          <ScrollBar
            key="interactive scroll bar"
            startPosition="bottom"
            ref={interactiveScrollBarRef}
            scrollableHeight={scrollableHeight}
            x={colWidth - PADDING - SCROLLBAR_WIDTH}
            gameHeight={gameHeight}
            onYChanged={newY => interactiveLayerRef.current?.y(newY)}
          />
          <ScrollBar
            key="algorithm scroll bar"
            startPosition="bottom"
            ref={algorithmScrollBarRef}
            scrollableHeight={scrollableHeight}
            x={totalGameWidth - PADDING - SCROLLBAR_WIDTH}
            gameHeight={gameHeight}
            onYChanged={newY => algorithmLayerRef.current?.y(newY)}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default OnlineStripPackingGame;
