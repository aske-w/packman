import { ExpectedData, GameSize, TestData, LastShelf } from './BestFitDecreasingHeight.fixture';
import { Dimensions } from '../../types/Dimensions.interface';
import { BestFitDecreasingHeight } from './BestFitDecreasingHeight';

describe('Best fit decreasing height tests', () => {
  let bfdh = new BestFitDecreasingHeight<{}>(GameSize);

  beforeEach(() => {
    bfdh = new BestFitDecreasingHeight(GameSize);
  });
  it('should return is finished with no data', () => {
    expect(bfdh.isFinished()).toBe(true);
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
    bfdh.load(rawData);

    expect(bfdh.data).toEqual(sortedData);
  });

  it('should place first rectangle correctly', () => {
    bfdh.load(rawData);
    bfdh.place();
    expect(bfdh.lastShelf.height).toBe(sortedData[0].height);
    expect(bfdh.lastShelf.remainingWidth).toBe(GameSize.width - sortedData[0].width);
  });

  it('should create a new shelf when width overflows current shelf width', () => {
    bfdh.load(TestData);

    ExpectedData.forEach(expected => {
      const actual = bfdh.place();
      expect(expected).toEqual(actual);
    });

    expect(bfdh.isFinished()).toBe(true);

    expect(bfdh.lastShelf).toEqual(LastShelf);
  });
});
