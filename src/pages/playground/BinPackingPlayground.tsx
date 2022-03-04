import Konva from 'konva';
import React, { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Bin from '../../components/playground/Bin';
import BinPackingSidebar from '../../components/Sidebar/BinPackingSidebar';
import { genId } from '../../config/canvasConfig';
import { useBinPackingAlgorithm } from '../../hooks/useBinPackingAlgorithm';
import { BinPackingAlgorithms } from '../../types/BinPackingAlgorithm.interface';
import { ColorRect } from '../../types/ColorRect.interface';
import { Dimensions } from '../../types/Dimensions.interface';
import { generateData, generateInventory } from '../../utils/generateData';

interface BinPackingPlaygroundProps {}
const width = window.innerWidth * 0.2;
const height = window.innerHeight * 0.8;
const BinPackingPlayground: React.FC<BinPackingPlaygroundProps> = ({}) => {
  const [dimensionsStorage, setDimensionsStorage] = useState<Dimensions[]>([]);

  const [algorithm, setAlgorithm] = useState(
    BinPackingAlgorithms.FINITE_NEXT_FIT
  );
  const { start, place, isFinished, algoState, pause, reset } =
    useBinPackingAlgorithm({ width, height }, algorithm);

  const placeNext = () => {
    const rect = place();
    if (rect) {
      // console.log({ rect });
      setBins(old => {
        const tmp = [...old.map(o => [...o])];
        if (tmp.length - 1 < rect.binId) {
          for (let i = tmp.length - 1; i < rect.binId; i++) {
            tmp.push([]);
          }
        }

        // console.log(JSON.stringify(tmp, null, 2));

        tmp[rect.binId].push({
          ...rect,
          fill: Konva.Util.getRandomColor(),
          name: genId(),
        });
        // console.log('tmp', JSON.stringify(tmp));

        return tmp;
      });
    }
  };
  const [bins, setBins] = useState<ColorRect[][]>([[]]);
  // console.log(JSON.stringify(bins, null, 1));

  return (
    <div className="h-full w-full flex ">
      <BinPackingSidebar
        {...{
          algoState,
          isFinished,
          algorithm,
          setAlgorithm,
          start,
          pause,
          reset: () => {
            setBins([]);
            reset();
          },
          placeNext,
          setDimensionsStorage,
          dimensionsStorage,
        }}
      />
      <div className="flex items-center justify-center p-10">
        <div className="grid gap-10 grid-cols-3 ">
          {bins.map((bin, i) => (
            <Bin key={i} height={height} width={width} items={bin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinPackingPlayground;
