import React, { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import BinInventory from '../../components/games/bin-packing/BinInventory';
import {
  NAV_HEIGHT,
  PADDING,
  SCROLLBAR_WIDTH,
} from '../../config/canvasConfig';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ColorRect } from '../../types/ColorRect.interface';
import { generateInventory } from '../../utils/generateData';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import ScrollBar from '../../components/canvas/ScrollBar';
import {
  defaultScrollHandler,
  useKonvaWheelHandler,
} from '../../hooks/useKonvaWheelHandler';
import BinInteractive from '../../components/games/bin-packing/BinInteractive';

interface BinPackingGameProps {}
const NUM_ITEMS = 10;
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
  const [staticInventory, setStaticInventory] = useState(
    generateInventory(inventoryWidth, NUM_ITEMS)
  );
  const [inventoryChanged, setInventoryChanged] = useState(true);
  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in the strip, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<ColorRect[]>([]);

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
    ],
  });

  return (
    <div className="w-full">
      <Stage onWheel={handleWheel} width={wWidth} height={gameHeight}>
        <Layer>
          {/* Inventory BG */}
          <Rect fill="#555" x={0} width={inventoryWidth} height={gameHeight} />
          {/* Interactive BG */}
          <Rect
            fill="#666"
            x={inventoryWidth}
            width={binAreaWidth}
            height={binAreaHeight}
          />
          {/* Algorithm BG */}
          <Rect
            fill="#444"
            x={inventoryWidth}
            y={binAreaHeight}
            width={binAreaWidth}
            height={binAreaHeight}
          />
        </Layer>

        <BinInventory
          ref={inventoryLayer}
          gameHeight={gameHeight}
          inventoryWidth={inventoryWidth}
          onDraggedToBin={(a, b) => console.log(a, b)}
          renderInventory={renderInventory}
          staticInventory={staticInventory}
        />
        <BinInteractive
          ref={interactiveLayer}
          dimensions={{
            width: binAreaWidth,
            height: binAreaHeight,
          }}
          offset={{ x: inventoryWidth, y: 0 }}
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
        </Layer>
      </Stage>
    </div>
  );
};

export default BinPackingGame;
