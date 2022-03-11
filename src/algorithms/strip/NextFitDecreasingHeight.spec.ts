import {
  ExpectedData,
  GameSize,
  TestData,
} from './NextFitDecreasingHeight.fixture';
import { Dimensions } from '../../types/Dimensions.interface';
import { NextFitDecreasingHeight } from './NextFitDecreasingHeight';

describe('Next fit decreasing height test', () => {
  let nfdh = new NextFitDecreasingHeight<{}>(GameSize);

  beforeEach(() => {
    nfdh = new NextFitDecreasingHeight<{}>(GameSize);
  });
  it('should return is finished with no data', () => {
    expect(nfdh.isFinished()).toBe(true);
  });

  const rawData: Dimensions[] = [
    {
      height: 100,
      width: 10,
    },
    {
      height: 103,
      width: 10,
    },
    {
      height: 10,
      width: 10,
    },
    {
      height: 1000,
      width: 10,
    },
  ];
  const sortedData: Dimensions[] = [
    {
      height: 1000,
      width: 10,
    },
    {
      height: 103,
      width: 10,
    },
    {
      height: 100,
      width: 10,
    },
    {
      height: 10,
      width: 10,
    },
  ];
  it('should sort data by non increasing height', () => {
    nfdh.load(rawData);

    expect(nfdh.data).toEqual(sortedData);
  });

  it('should place rectangles correctly', () => {
    nfdh.load(rawData);
    nfdh.place();
    expect(nfdh.shelf.height).toBe(sortedData[0].height);
    expect(nfdh.shelf.remainingWidth).toBe(
      GameSize.width - sortedData[0].width
    );
  });

  it('should create a new shelf when width overflows current shelf width', () => {
    nfdh.load(TestData);

    ExpectedData.forEach(expected => {
      const actual = nfdh.place();
      expect(expected).toEqual(actual);
    });

    expect(nfdh.isFinished()).toBe(true);

    const lastShelf: NextFitDecreasingHeight['shelf'] = {
      remainingWidth: GameSize.width - 120,
      bottomY: -200,
      height: 160,
    };

    expect(nfdh.shelf).toEqual(lastShelf);
  });
});
