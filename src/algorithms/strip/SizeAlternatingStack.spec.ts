import { SizeAlternatingStack } from './SizeAlternatingStack';
import {
  ExpectedData,
  GameSize,
  TestData,
} from './SizeAlternatingStack.fixture';

describe('SizeAlternatingStack test suite', () => {
  let sas = new SizeAlternatingStack<{}>(GameSize);

  beforeEach(() => {
    sas = new SizeAlternatingStack(GameSize);
  });
  it('should return is finished with no data', () => {
    expect(sas.isFinished()).toBe(true);
  });

  it('should place correctly', () => {
    sas.load(TestData);
    let i = 0;
    while (!sas.isFinished()) {
      const next = sas.place();

      expect(next).toEqual(ExpectedData[i++]);
    }
  });
});
