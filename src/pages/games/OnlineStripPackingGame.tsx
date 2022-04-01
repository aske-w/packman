import Konva from 'konva';
import { Group as KonvaGroup } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import OnlineStripPackingAlgorithm, {
  OnlineStripPackingAlgorithmHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingAlgorithm';
import OnlineStripPackingInteractive, {
  OnlineStripPackingInteractiveHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingInteractive';
import OnlineStripPackingInventory from '../../components/games/onlineStripPacking/OnlineStripPackingInventory';
import OnlineStripPackingNav from '../../components/Nav/OnlineStripPackingNav';
import { NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useOnlineStripPackingInventory } from '../../hooks/useOnlineStripPackingInventory';
import { useSnap } from '../../hooks/useSnap';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm.store';
import useScoreStore from '../../store/score.store';
import { ColorRect } from '../../types/ColorRect.interface';
import { Rectangle } from '../../types/Rectangle.interface';
import { intersects } from '../../utils/intersects';
interface OnlineStripPackingGameProps {}

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
  const { visibleInventory, inventory } = useOnlineStripPackingInventory({
    inventoryWidth,
    inventoryHeight: gameHeight,
    placedRects,
  });

  useEffect(() => setRectanglesLeft(inventory.length - placedRects.length), [inventory, placedRects]);

  const interactiveLayerRef = useRef<KonvaLayer>(null);
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveHandle = useRef<OnlineStripPackingInteractiveHandle>(null);

  const inventoryLayerRef = useRef<KonvaLayer>(null);

  const algorithmLayerRef = useRef<KonvaLayer>(null);
  const algorithmScrollBarRef = useRef<KonvaRect>(null);
  const algorithm = useAlgorithmStore(useCallback(state => state.onlineStripPackingAlgorithm, []));
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

  /**
   * Pos is absolute position in the canvas
   */
  const onDraggedToStrip = (rectName: string, pos: Vector2d): boolean => {
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

      interactiveHandle.current?.place(rect, placement);
      algorithmHandle.current?.place(rect);
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

  return (
    <div className="w-full h-full">
      <OnlineStripPackingNav />

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
          x={colWidth + inventoryWidth}
          layerRef={algorithmLayerRef}
          gameHeight={gameHeight}
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
