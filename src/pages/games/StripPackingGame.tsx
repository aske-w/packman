import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import Inventory from '../../components/games/stripPacking/Inventory';
import StripPackingAlgorithm, {
  StripPackingAlgorithmHandle,
} from '../../components/games/stripPacking/StripPackingAlgorithm';
import StripPackingInteractive, {
  StripPackingInteractiveHandle,
} from '../../components/games/stripPacking/StripPackingInteractive';
import {
  NAV_HEIGHT,
  PADDING,
  SCROLLBAR_WIDTH,
} from '../../config/canvasConfig';
import {
  defaultScrollHandler,
  useKonvaWheelHandler,
} from '../../hooks/useKonvaWheelHandler';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm';
import useScoreStore from '../../store/score';
import { ColorRect } from '../../types/ColorRect.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';
import { generateInventory } from '../../utils/generateData';

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
  const onDraggedToStrip = (rectName: string, pos: Vector2d) => {
    const rIdx = renderInventory.findIndex(r => r.name === rectName);

    if (rIdx !== -1) {
      const rect = renderInventory[rIdx];
      // Place in algorithm canvas
      const res = algoRef.current?.place(rect);

      const interactiveScrollOffset = interactiveLayerRef.current?.y()!;

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
          />
          <Inventory
            ref={inventoryLayer}
            staticInventory={startingInventory}
            dynamicInventory={renderInventory}
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
          />
        </Stage>
      </div>
    </div>
  );
};

export default StripPackingGame;
