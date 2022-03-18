import Konva from 'konva';
import React, { useState } from 'react';
import Bin from '../../components/playground/Bin';
import BinPackingSidebar from '../../components/Sidebar/BinPackingSidebar';
import { genId } from '../../config/canvasConfig';
import { useBinPackingAlgorithm } from '../../hooks/useBinPackingAlgorithm';
import { BinPackingAlgorithms } from '../../types/BinPackingAlgorithm.interface';
import { ColorRect } from '../../types/ColorRect.interface';
import { Dimensions } from '../../types/Dimensions.interface';

interface BinPackingPlaygroundProps {}
const width = Math.floor(window.innerWidth * 0.2);
const height = Math.floor(window.innerHeight * 0.1);

const BinPackingPlayground: React.FC<BinPackingPlaygroundProps> = ({}) => {
  const [dimensionsStorage, setDimensionsStorage] = useState<Dimensions[]>([]);
  const [binDimensions, setBinDimensions] = useState<Dimensions>({
    width,
    height,
  });

  const [algorithm, setAlgorithm] = useState(BinPackingAlgorithms.HYBRID_FIRST_FIT);
  const { start, place, isFinished, algoState, pause, reset } = useBinPackingAlgorithm(binDimensions, algorithm);

  const placeNext = () => {
    const rect = place();
    console.log(rect);

    if (rect) {
      // update ui in sidebar
      setDimensionsStorage(d => d.filter(d => !(d.height === rect.height && d.width === rect.width)));
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
    <div className="flex w-full h-full ">
      <BinPackingSidebar
        {...{
          algoState,
          isFinished,
          algorithm,
          setAlgorithm,
          start,
          pause,
          reset: () => {
            setBins([[]]);
            reset();
          },
          placeNext,
          setDimensionsStorage,
          dimensionsStorage,
          setBinDimensions,
          binDimensions,
        }}
      />
      <div className="inline-flex items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="flex justify-start items-start flex-wrap h-full flex-shrink-0 gap-5 p-5 w-[calc(100vw-360px)]">
          {bins.map((bin, i) => (
            <Bin key={i} height={binDimensions.height} width={binDimensions.width} items={bin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinPackingPlayground;
