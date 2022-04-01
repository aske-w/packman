import Konva from 'konva';
import { Group as KonvaGroup } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import OnlineStripPackingAlgorithm, {
  OnlineStripPackingAlgorithmHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingAlgorithm';
import OnlineStripPackingInteractive, {
  OnlineStripPackingInteractiveHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingInteractive';
import OnlineStripPackingInventory from '../../components/games/onlineStripPacking/OnlineStripPackingInventory';
import { NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useSnap } from '../../hooks/useSnap';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm.store';
import { ColorRect } from '../../types/ColorRect.interface';
import { Rectangle } from '../../types/Rectangle.interface';
import { generateData } from '../../utils/generateData';
import { intersects } from '../../utils/intersects';
interface OnlineStripPackingGameProps {}

const OnlineStripPackingGame: React.FC<OnlineStripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const totalGameWidth = Math.min(wWidth, 1280);
  const gameHeight = wHeight - NAV_HEIGHT;
  const inventoryWidth = totalGameWidth * 0.3;
  const colWidth = (totalGameWidth - inventoryWidth) / 2;
  const scrollableHeight = gameHeight * 1.5;

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);

  const [inventory, setInventory] = useState(() =>
    generateData(100, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() }))
  );
  const interactiveLayerRef = useRef<KonvaLayer>(null);
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveHandle = useRef<OnlineStripPackingInteractiveHandle>(null);

  const inventoryLayerRef = useRef<KonvaLayer>(null);

  const algorithmLayerRef = useRef<KonvaLayer>(null);
  const algorithmScrollBarRef = useRef<KonvaRect>(null);
  const algorithm = useAlgorithmStore(useCallback(state => state.onlineStripPackingAlgorithm, []));
  const algorithmHandle = useRef<OnlineStripPackingAlgorithmHandle>(null);

  const [shownInventory, setShownInventory] = useState(() => {
    return inventory.reduce<ColorRect[]>((acc, attrs, i) => {
      const { height, width } = attrs;

      const rect: any = {
        width,
        height,
        x: PADDING,
        y: PADDING,
        fill: Konva.Util.getRandomColor(),
        name: nanoid(),
      };
      if (i === 0) {
        acc.push(rect);
      } else {
        const prev = acc[i - 1];
        rect.y = prev.height + prev.y + PADDING * 2;
        acc.push(rect);
      }

      return acc;
    }, []);
  });

  // Snapping
  const { snapInventory, snapInteractive } = useSnap<ColorRect>({
    inventory: shownInventory,
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
    const rIdx = shownInventory.findIndex(r => r.name === rectName);

    if (rIdx !== -1) {
      const rect = shownInventory[rIdx];
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

      setShownInventory(prev => {
        const newInventory = [...prev];
        newInventory.splice(rIdx, 1);
        return newInventory;
      });
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
    <div className="flex justify-center h-full max-w-screen-xl mx-auto ">
      <Stage onWheel={handleWheel} width={totalGameWidth} height={gameHeight}>
        <Layer>
          {/* Interactive BG */}
          <Rect fill="#666" x={0} width={colWidth} height={gameHeight} />
          {/* Inventory BG */}
          <Rect fill="#555" x={colWidth} width={inventoryWidth} height={gameHeight} />
          {/* Algorithm BG */}
          <Rect fill="#444" x={colWidth + inventoryWidth} width={colWidth} height={gameHeight} />
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
          onDraggedToStrip={onDraggedToStrip}
          snap={(target: Shape) => snapInventory(interactiveLayerRef.current?.children as KonvaGroup[], target)}
          ref={inventoryLayerRef}
          x={colWidth}
          shownInventory={shownInventory}
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
      </Stage>
    </div>
  );
};

export default OnlineStripPackingGame;
