import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { IRect, Vector2d } from 'konva/lib/types';
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Group, Layer, Rect, Text } from 'react-konva';
import FiniteFirstFit from '../../../algorithms/bin/offline/FiniteFirstFit';
import FiniteNextFit from '../../../algorithms/bin/offline/FiniteNextFit';
import HybridFirstFit from '../../../algorithms/bin/offline/HybridFirstFit';
import algorithm from '../../../store/algorithm';
import { BinPackingAlgorithms } from '../../../types/BinPackingAlgorithm.interface';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
interface BinAlgorithmProps {
  offset: Vector2d;
  dimensions: Dimensions;
  binSize: Dimensions;
  selectedAlgorithm: BinPackingAlgorithms;
  data: DimensionsWithConfig[];
  binLayout: IRect[];
}
export interface BinAlgorithmHandle {
  place: () => void;
}

const PADDING = 30;
const { FINITE_FIRST_FIT, FINITE_NEXT_FIT, HYBRID_FIRST_FIT } =
  BinPackingAlgorithms;
const BinAlgorithm = forwardRef<BinAlgorithmHandle, BinAlgorithmProps>(
  (
    { offset, dimensions, data, selectedAlgorithm, binSize, binLayout },
    ref
  ) => {
    const [placed, setPlaced] = useState<
      ColorRect<
        RectangleConfig & {
          binId: number;
        }
      >[]
    >([]);

    useImperativeHandle(ref, () => ({
      place: () => {
        if (algorithm.current?.isFinished()) return;
        const r = algorithm.current?.place();
        if (!r) return;
        setPlaced(p => p.concat(r));
      },
    }));

    const algorithm =
      useRef<PackingAlgorithm<{}, RectangleConfig & { binId: number }>>();
    const start = (data: DimensionsWithConfig[]) => {
      switch (selectedAlgorithm) {
        case FINITE_NEXT_FIT:
          algorithm.current = new FiniteNextFit(binSize).load(data);
          break;

        case FINITE_FIRST_FIT:
          algorithm.current = new FiniteFirstFit(binSize).load(data);
          break;

        case HYBRID_FIRST_FIT:
          algorithm.current = new HybridFirstFit(binSize).load(data);
          break;

        default:
          console.error('unkown algorithm:', selectedAlgorithm);
          break;
      }
    };
    useEffect(() => {
      start([...data]);
    }, [selectedAlgorithm]);

    return (
      <Layer y={offset.y} x={offset.x}>
        {binLayout.map((b, i) => {
          const binRects = placed.filter(({ binId }) => binId === i);
          console.log(binRects);

          return (
            <Fragment key={i}>
              <Rect {...b} fill={'#eee'} opacity={0.5} />
              <Text text={i.toString()} x={b.x} y={b.y} fontSize={24} />
              {binRects?.map(r => (
                <Rect
                  {...r}
                  x={r.x + b.x}
                  y={r.y + b.y + b.height}
                  key={r.name}
                />
              ))}
            </Fragment>
          );
        })}
      </Layer>
    );
  }
);

export default BinAlgorithm;
