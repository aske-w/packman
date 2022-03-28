import Konva from 'konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';
import ScrollBar from '../../components/canvas/ScrollBar';
import OnlineStripPackingAlgorithm, {
  OnlineStripPackingAlgorithmHandle,
} from '../../components/games/onlineStripPacking/OnlineStripPackingAlgorithm';
import { NAV_HEIGHT, PADDING, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { defaultScrollHandler, useKonvaWheelHandler } from '../../hooks/useKonvaWheelHandler';
import { useWindowSize } from '../../hooks/useWindowSize';
import useAlgorithmStore from '../../store/algorithm';
import { ColorRect } from '../../types/ColorRect.interface';
import { generateData } from '../../utils/generateData';
interface OnlineStripPackingGameProps {}

const OnlineStripPackingGame: React.FC<OnlineStripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const totalGameWidth = Math.min(wWidth, 1280);
  const gameHeight = wHeight - NAV_HEIGHT;
  const inventoryWidth = totalGameWidth * 0.3;
  const colWidth = (totalGameWidth - inventoryWidth) / 2;
  const scrollableHeight = gameHeight * 1.5;

  const interactiveLayerRef = useRef<KonvaLayer>(null);
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const algorithmLayerRef = useRef<KonvaLayer>(null);
  const algorithmScrollBarRef = useRef<KonvaRect>(null);

  const algorithm = useAlgorithmStore(useCallback(state => state.onlineStripPackingAlgorithm, []));
  const algorithmHandle = useRef<OnlineStripPackingAlgorithmHandle>(null);
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

  const [inventory, setInventory] = useState(() =>
    generateData(100, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() }))
  );
  const shownInventory = useMemo(() => {
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
  }, []);

  return (
    <div className="flex justify-center h-full max-w-screen-xl mx-auto ">
      <button
        onClick={() => {
          const toPlace = inventory.shift();
          console.log('toPlace', toPlace);

          if (!toPlace) return;
          setInventory(inventory);
          algorithmHandle.current?.place(toPlace);
        }}
      >
        place
      </button>
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

        <Layer x={colWidth}>
          {shownInventory.map((r, i) => (
            <Group draggable key={r.name}>
              <Rect {...r} />
              <Text fontSize={20} {...r} fill="black" text={`${i}`} />
            </Group>
          ))}
        </Layer>
        <Layer y={-gameHeight} ref={interactiveLayerRef}></Layer>
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
