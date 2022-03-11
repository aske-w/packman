import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import Inventory from '../../components/games/stripPacking/Inventory';
import StripPackingAlgorithm, {
  StripPackingAlgorithmHandle,
} from '../../components/games/stripPacking/StripPackingAlgorithm';
import {
  GAME_HEIGHT,
  NAV_HEIGHT,
  RECT_OVERLAP_COLOR,
  SCROLLBAR_HEIGHT,
  SNAPPING_THRESHOLD,
} from '../../config/canvasConfig';
import { useWindowSize } from '../../hooks/useWindowSize';
import {
  interactiveScrollHandler,
  inventoryScrollHandler,
  useKonvaWheelHandler,
} from '../../hooks/useKonvaWheelHandler';
import { ColorRect } from '../../types/ColorRect.interface';
import { generateInventory } from '../../utils/generateData';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import ScrollBar from '../../components/canvas/ScrollBar';
import { SCROLLBAR_WIDTH, PADDING } from '../../config/canvasConfig';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { RectangleConfig } from '../../types/RectangleConfig.interface';

import StripPackingInteractive, {
  StripPackingInteractiveHandle,
} from '../../components/games/stripPacking/StripPackingInteractive';
import { Vector2d } from 'konva/lib/types';
import useAlgorithmStore from '../../store/algorithm';
import useScoreStore from '../../store/score';
import { Group } from 'konva/lib/Group';
import { intersects } from '../../utils/intersects';
import { Rectangle } from '../../types/Rectangle.interface';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Coordinate } from '../../types/Coordinate.interface';

interface StripPackingGameProps {}
const NUM_ITEMS = 50;
const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.2;
  const inventoryWidth = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;

  const algorithm = useAlgorithmStore(
    useCallback(state => state.algorithm, [])
  );
  const setRectanglesLeft = useScoreStore(
    useCallback(state => state.setRectanglesLeft, [])
  );

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  /**
   * This is the immutable inventory, used for rendering the ghosts
   */
  const [startingInventory, setStartingInventory] = useState<
    ReadonlyArray<ColorRect<RectangleConfig & { order?: number }>>
  >(() => []);
  const [inventoryChanged, setInventoryChanged] = useState(true);
  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in the strip, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<
    ColorRect<RectangleConfig>[]
  >([]);
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
  const inventoryScrollOffsetRef = useRef(0);
  // interactive scroll
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveLayerRef = useRef<KonvaLayer>(null);

  useEffect(() => {
    const reset = () => {
      setStartingInventory(generateInventory(inventoryWidth, NUM_ITEMS));
      setInventoryChanged(true);
      interactiveRef.current?.reset();
    };
    reset();
  }, [algorithm]);

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
      
      const rectToPlace: Rectangle = {x: pos.x, y: -interactiveScrollOffset + pos.y, width: rect.width, height: rect.height};
      
      interactiveRects?.forEach(ir => {
        if(intersects(ir.getAttrs(), rectToPlace))
          intersectAny = true;
      });
      
      if(intersectAny) 
        return false;
      
      // Place in algorithm canvas
      const res = algoRef.current?.place(rect);
      
      const placement = {
        x: pos.x,
        y: pos.y - gameHeight - interactiveScrollOffset,
      };

      interactiveRef.current?.place(rect, placement);

      setRenderInventory(old => {
        const tmp = [...old];
        tmp.splice(rIdx, 1);
        return tmp;
      });

      setRectanglesLeft(renderInventory.length - 1);

      if (res) {
        const [placedName, order] = res;

        // give the order of placement to the starting state
        setStartingInventory(old => {
          const tmp = [...old];
          const idx = tmp.findIndex(r => r.name === placedName);
          if (idx === -1) return old;
          tmp[idx] = { ...tmp[idx], order };
          return tmp;
        });
      }
    }
    return true;
  };
  
  const snapInteractive = (destination: Group[], target: Shape) => {
    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    })
    snap(newDestination, target);
  }

  const snapInventory = (destination: Group[], target: Shape) => {
    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    })
    const stripScrollOffset = interactiveLayerRef.current?.y()!;
    const {x, y} = target.getAttrs();
    const adjustedY = (y + inventoryLayer.current?.y()!) - stripScrollOffset;
    const adjustedX = x + stripWidth;
    snap(newDestination, target, {x: adjustedX, y: adjustedY});
  }

  
  const snap = (destination: ColorRect<RectangleConfig>[], target: Shape, overrideXY?: Coordinate) => {
    let intersectsAny = false;
    
    destination.forEach(f => {
      const { name, x, y, height, width } = f;
      let { x: targetX, y: targetY, height: targetHeight, width: targetWidth, name: targetName } = target.getAttrs();
      const stripScrollOffset = interactiveLayerRef.current?.y()!;

      if(overrideXY != undefined) {
        targetX = overrideXY.x;
        targetY = overrideXY.y;
      }

      if (name == targetName) return;

      if ((x - SNAPPING_THRESHOLD < targetX + targetWidth && targetX + targetWidth < x + SNAPPING_THRESHOLD && y < targetY + targetHeight && y + height > targetY)) {
        // Snap target's right side to f's left side 
        target.setAbsolutePosition({ x: x - targetWidth, y: targetY + stripScrollOffset });

      } else if (((x + width) - SNAPPING_THRESHOLD < targetX && (x + width) + SNAPPING_THRESHOLD > targetX) && y < targetY + targetHeight && y + height > targetY) {
        // Snap target's left side to f's right side
        target.setAbsolutePosition({ x: x + width, y: targetY + stripScrollOffset });

      } else if (((y + height) - SNAPPING_THRESHOLD < targetY && (y + height) + SNAPPING_THRESHOLD > targetY) && x < targetX + targetWidth && x + width > targetX) {
        // Snap target's top side to f's bottom side
        target.setAbsolutePosition({ x: targetX, y: y + height + stripScrollOffset });

      } else if (((y + SNAPPING_THRESHOLD) > targetY + targetHeight && (y - SNAPPING_THRESHOLD) < targetY + targetHeight) && x < targetX + targetWidth && x + width > targetX) {
        // Snap target's bottom side to f's top side
        target.setAbsolutePosition({ x: targetX, y: y - targetHeight + stripScrollOffset });

      } else if (intersects(f, {x: targetX, y: targetY, height: targetHeight, width: targetWidth})) {
        intersectsAny = true;
      }
    });
    if (intersectsAny) {
      //overlap while dragging
      target.setAttr("fill", RECT_OVERLAP_COLOR);
    } else {
      //no overlap while dragging
      let color = startingInventory.find(r => r.name == target.name())!.fill
      target.setAttr("fill", color!.substring(0, 7) + "80");
    }
  };

  const handleWheel = useKonvaWheelHandler({
    handlers: [
      inventoryScrollHandler({
        area: {
          minX: stripWidth,
          maxX: stripWidth + inventoryWidth,
        },
        gameHeight,
        layerRef: inventoryLayer,
        scrollBarRef: inventoryScrollBarRef,
        scrollableHeight,
        scrollOffsetRef: inventoryScrollOffsetRef,
      }),
      interactiveScrollHandler({
        area: {
          minX: 0,
          maxX: stripWidth,
        },
        gameHeight,
        layerRef: interactiveLayerRef,
        scrollBarRef: interactiveScrollBarRef,
        scrollableHeight,
      }),
    ],
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <Stage
          onWheel={handleWheel}
          width={window.innerWidth}
          height={gameHeight}>
          <Layer>
            {/* Strip canvas */}
            <Rect fill="#555" x={0} width={stripWidth} height={gameHeight} />
            {/* Inventory */}
            <Rect
              fill="#333"
              x={stripWidth}
              width={inventoryWidth}
              height={gameHeight}
            />
            {/* Algorithm canvas */}
            <Rect
              fill="#555"
              x={inventoryWidth + stripWidth}
              width={stripWidth}
              height={gameHeight}
            />
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
            inventoryScrollOffset={inventoryScrollOffsetRef}
            ref={algoRef}
            inventoryWidth={inventoryWidth}
            x={inventoryWidth + stripWidth}
            width={stripWidth}
            height={gameHeight}
            inventory={startingInventory}
            algorithm={algorithm}
          />
        </Stage>
      </div>
    </div>
  );
};

export default StripPackingGame;
