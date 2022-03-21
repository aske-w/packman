import { Group } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import Inventory from '../../components/games/stripPacking/Inventory';
import StripPackingAlgorithm, { StripPackingAlgorithmHandle } from '../../components/games/stripPacking/StripPackingAlgorithm';
import StripPackingGameIntroModal from '../../components/games/stripPacking/StripPackingGameIntroModal';
import StripPackingInteractive, { StripPackingInteractiveHandle } from '../../components/games/stripPacking/StripPackingInteractive';
import {
  ALGO_MOVE_ANIMATION_DURATION,
  NAV_HEIGHT,
  PADDING,
  RECT_OVERLAP_COLOR,
  SCROLLBAR_WIDTH,
  SNAPPING_THRESHOLD,
  STROKE_WIDTH,
} from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm.store';
import useScoreStore from '../../store/score.store';
import { ColorRect } from '../../types/ColorRect.interface';
import { Coordinate } from '../../types/Coordinate.interface';
import { Rectangle } from '../../types/Rectangle.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';
import { pushItemToBack } from '../../utils/array';
import { clamp } from '../../utils/clamp';
import { compressInventory, generateInventory } from '../../utils/generateData';
import { intersects } from '../../utils/intersects';
import TimeBar from '../../components/TimeBar';
import { useEvents } from '../../hooks/useEvents';
import { Events } from '../../types/Events.enum';
import { sleep } from '../../utils/utils';
import GameEndModal from '../../components/gameEndModal/Modal';
import { useRestartStripPacking } from '../../hooks/useRestartStripPacking';

interface StripPackingGameProps {}
const NUM_ITEMS = 5;
const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.2;
  const inventoryWidth = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;

  const algorithm = useAlgorithmStore(useCallback(({ algorithm }) => algorithm, []));
  const setRectanglesLeft = useScoreStore(useCallback(({ setRectanglesLeft }) => setRectanglesLeft, []));

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  /**
   * This is the immutable inventory, used for rendering the ghosts
   */
  const [startingInventory, setStartingInventory] = useState<ReadonlyArray<ColorRect<RectangleConfig & { order?: number; removed?: boolean }>>>(
    () => []
  );
  const [inventoryChanged, setInventoryChanged] = useState(true);

  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in the strip, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<ColorRect<RectangleConfig>[]>([]);

  const { onPlaceEvent, event } = useEvents();

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

  const resetFuncs = [
    () => setStartingInventory(generateInventory(inventoryWidth, NUM_ITEMS)),
    () => setInventoryChanged(true),
    interactiveRef.current?.reset,
    algoRef.current?.reset,
  ];

  useRestartStripPacking(resetFuncs, algorithm);

  /**
   * Pos is absolute position in the canvas
   */
  const onDraggedToStrip = (rectName: string, pos: Vector2d): boolean => {
    const rIdx = renderInventory.findIndex(r => r.name === rectName);

    if (rIdx !== -1) {

      const rect = renderInventory[rIdx];
      const interactiveScrollOffset = interactiveLayerRef.current?.y()!;
      const interactiveRects = interactiveLayerRef.current?.children;

      let intersectAny = false;

      const rectToPlace: Rectangle = {
        x: pos.x,
        y: -interactiveScrollOffset + pos.y,
        width: rect.width,
        height: rect.height,
      };

      interactiveRects?.forEach(ir => {
        if (intersects(ir.getAttrs(), rectToPlace)) intersectAny = true;
      });

      
      if (intersectAny || rectToPlace.x < 0 || rectToPlace.x > stripWidth || rectToPlace.y < 0 || rectToPlace.y > scrollableHeight) return false;
      
      onPlaceEvent(renderInventory.length);
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

  const snapInteractive = (destination: Group[], target: Shape) => {
    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    });

    target.setAttr('x', clamp(target.getAttr('x'), 0, stripWidth - target.getAttr('width')));
    target.setAttr('y', clamp(target.getAttr('y'), 0, scrollableHeight - target.getAttr('height')));
    snap(newDestination, target);
  };

  const snapInventory = (destination: Group[], target: Shape) => {
    const { x, y } = target.getAttrs();

    // don't try to snap if target is still in the inventory
    if (x > SNAPPING_THRESHOLD) {
      return;
    }

    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    });
    const stripScrollOffset = interactiveLayerRef.current?.y()!;
    const adjustedY = clamp(y + inventoryLayer.current?.y()! - stripScrollOffset, 0, scrollableHeight);
    const adjustedX = clamp(x + stripWidth, 0, stripWidth + inventoryWidth);
    snap(newDestination, target, { x: adjustedX, y: adjustedY });
  };

  const snap = (destination: ColorRect<RectangleConfig>[], target: Shape, overrideXY?: Coordinate) => {
    let intersectsAny = false;
    let { x: targetX, y: targetY, height: targetHeight, width: targetWidth, name: targetName } = target.getAttrs();
    target.moveToTop();
    const stripScrollOffset = interactiveLayerRef.current?.y()!;

    if (overrideXY != undefined) {
      targetX = overrideXY.x;
      targetY = overrideXY.y;
    }

    let cx = targetX;
    let cy = targetY;
    let xDist: number | undefined;
    let yDist: number | undefined;

    if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
      // Snap target's right side to strip's right side
      cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
    } else if (0 + SNAPPING_THRESHOLD > targetX) {
      // Snap target's left side to strip's left side
      cx = 0;
    }

    if (0 + SNAPPING_THRESHOLD > targetY) {
      // Snap target's top to the top of the strip
      if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
        //this is necessary to properly snap in the bottom right corner of the strip when dragging from inventory
        cy = 0;
        cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
      } else {
        cy = 0;
      }
    } else if (scrollableHeight < targetY + targetHeight + STROKE_WIDTH / 2) {
      // Snap target's bottom to the bottom of the strip
      if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
        //this is necessary to properly snap in the bottom right corner of the strip when dragging from inventory
        cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
        cy = gameHeight + -stripScrollOffset - targetHeight;
      } else {
        cy = gameHeight + -stripScrollOffset - targetHeight;
      }
    }

    destination.forEach(f => {
      const { name, x, y, height, width } = f;

      if (name == targetName) return;

      if (
        intersects(f, {
          x: targetX,
          y: targetY,
          height: targetHeight,
          width: targetWidth,
        })
      ) {
        intersectsAny = true;
      } else {
        if (
          x - SNAPPING_THRESHOLD < targetX + targetWidth &&
          targetX + targetWidth < x + SNAPPING_THRESHOLD &&
          y < targetY + targetHeight &&
          y + height > targetY
        ) {
          // Snap target's right side to f's left side
          if (xDist == undefined || xDist > x - targetX + targetWidth) cx = x - targetWidth;
        } else if (
          x + width - SNAPPING_THRESHOLD < targetX &&
          x + width + SNAPPING_THRESHOLD > targetX &&
          y < targetY + targetHeight &&
          y + height > targetY
        ) {
          // Snap target's left side to f's right side
          if (xDist == undefined || xDist > targetX - (x + width)) cx = x + width;
        }
        if (
          y + height - SNAPPING_THRESHOLD < targetY &&
          y + height + SNAPPING_THRESHOLD > targetY &&
          x < targetX + targetWidth &&
          x + width > targetX
        ) {
          // Snap target's top side to f's bottom side
          if (yDist == undefined || yDist > targetY - (y + height)) cy = y + height;
        } else if (
          y + SNAPPING_THRESHOLD > targetY + targetHeight &&
          y - SNAPPING_THRESHOLD < targetY + targetHeight &&
          x < targetX + targetWidth &&
          x + width > targetX
        ) {
          // Snap target's bottom side to f's top side
          if (yDist == undefined || yDist > y - (targetY + targetHeight)) cy = y - targetHeight;
        }
      }
    });

    target.setAbsolutePosition({ x: cx, y: cy + stripScrollOffset });
    if (intersectsAny || targetX < 0 || targetY < 0 || targetY > scrollableHeight) {
      //overlap while dragging
      target.setAttr('fill', RECT_OVERLAP_COLOR);
    } else {
      //no overlap while dragging
      let color = startingInventory.find(r => r.name == target.name())!.fill;
      target.setAttr('fill', color!.substring(0, 7) + '80');
    }
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
