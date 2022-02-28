import React, {
  MutableRefObject,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Layer, Rect } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { STRIP_SIZE } from '../../../config/canvasConfig';
import { Vector2d } from 'konva/lib/types';
interface StripPackingInteractiveProps {
  height: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  scrollableHeight: number;
  inventoryScrollOffset: React.MutableRefObject<number>;
  interactiveScrollOffset: React.MutableRefObject<number>;
}

export interface StripPackingInteractiveHandle {
  place: (r: ColorRect, pos: Vector2d) => void;
}

const StripPackingInteractive = React.forwardRef<
  StripPackingInteractiveHandle,
  StripPackingInteractiveProps
>(
  (
    {
      layerRef,
      height,
      scrollableHeight,
      interactiveScrollOffset,
      inventoryScrollOffset,
    },
    ref
  ) => {
    const [stripRects, setStripRects] = useState<ColorRect[]>([]);

    useImperativeHandle(ref, () => ({
      place: (r, { x, y }) => {
        const newRect = {
          ...r,
          x,
          y,
        };

        setStripRects(old => [...old, newRect]);
      },
    }));
    return (
      <>
        <Layer y={-(scrollableHeight - height)} x={0} ref={layerRef}>
          {stripRects.map((r, i) => {
            return (
              <Rect
                key={r.name}
                {...r}
                draggable
                strokeWidth={2}
                stroke="red"
                y={r.y + height}
                // onDragEnd={handleStripDragEnd}
                // onDragMove={handleDragMove}
                id={`STRIP_RECT`}
              />
            );
          })}
        </Layer>
      </>
    );
  }
);

export default StripPackingInteractive;
