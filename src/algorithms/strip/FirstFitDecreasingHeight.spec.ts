import { ExpectedData, GameSize, TestData, LastShelf } from './FirstFitDecreasingHeight.fixture';
import { Dimensions } from '../../types/Dimensions.interface';
import { FirstFitDecreasingHeight } from './FirstFitDecreasingHeight';

describe('First fit decreasing height test', () => {
  let ffdh = new FirstFitDecreasingHeight<{}>(GameSize);

  beforeEach(() => {
    ffdh = new FirstFitDecreasingHeight(GameSize);
  });
  it('should return is finished with no data', () => {
    expect(ffdh.isFinished()).toBe(true);
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
    ffdh.load(rawData);

    expect(ffdh.data).toEqual(sortedData);
  });

  it('should place first rectangle correctly', () => {
    ffdh.load(rawData);
    ffdh.place();
    expect(ffdh.lastShelf.height).toBe(sortedData[0].height);
    expect(ffdh.lastShelf.remainingWidth).toBe(GameSize.width - sortedData[0].width);
  });

  it('should create a new shelf when width overflows current shelf width', () => {
    ffdh.load(TestData);

    ExpectedData.forEach(expected => {
      const actual = ffdh.place();
      expect(expected).toEqual(actual);
    });

    expect(ffdh.isFinished()).toBe(true);

    expect(ffdh.lastShelf).toEqual(LastShelf);
  });
});
