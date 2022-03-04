import React, {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Layer, Rect } from "react-konva";
import { ColorRect } from "../../../types/ColorRect.interface";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { STRIP_SIZE } from "../../../config/canvasConfig";
import { Vector2d } from "konva/lib/types";
import useScoreStore from "../../../store/score";
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
    const setScore = useScoreStore(useCallback((state) => state.setScore, []));

    useEffect(() => {
      const _height = stripRects.reduce(
        (maxY, r) => Math.max(maxY, Math.round(height - r.y)),
        0
      );
      setScore({ height: _height }, "user");
    }, [stripRects, height]);

    useImperativeHandle(ref, () => ({
      place: (r, { x, y }) => {
        const newRect = {
          ...r,
          x,
          y,
        };

        setStripRects((old) => [...old, newRect]);
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
