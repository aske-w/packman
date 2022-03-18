import { Dimensions } from '../../types/Dimensions.interface';
import { Rectangle } from '../../types/Rectangle.interface';
export const GameSize: Dimensions = {
  width: 1000,
  height: 1000,
};
const Narrows = [
  { width: 100, height: 400 }, // 1
  { width: 10, height: 350 }, // 6
  { width: 60, height: 300 }, // 10
  { width: 15, height: 200 }, //9
  { width: 20, height: 100 }, // 4
];

const Wides = [
  { width: 300, height: 250 }, // 2
  { width: 250, height: 50 }, // 3
  { width: 150, height: 100 }, // 5
  { width: 100, height: 30 }, // 7
  { width: 80, height: 20 }, // 8
];

export const TestData: Dimensions[] = Narrows.concat(Wides).sort(() => (Math.random() < 0.5 ? -1 : 1));

// Pack wide
export const ExpectedData: Rectangle[] = [
  // 1
  {
    width: 100,
    height: 400,
    x: 0,
    y: -400,
  },
  //   2 - Pack wide
  {
    width: 300,
    height: 250,
    x: 100,
    y: -250,
  },
  //  3 - Remaing h: 400-250 = 150
  {
    width: 250,
    height: 50,
    x: 100,
    y: -300, // -250 - 50
  },
  // 4 -  Ueneven width
  {
    width: 20,
    height: 100,
    x: 350, // 250 + 100
    y: -350, // -250 - 100
  },
  //  5 -  Pack wide x-y
  {
    width: 150,
    height: 100,
    x: 100, // 250 + 100
    y: -400, // -300 - 150
  },

  //  6 New shelf -
  {
    width: 10,
    height: 350,
    x: 0, // 250 + 100
    y: -750, // -350 - 400
  },
  // 7
  {
    width: 100,
    height: 30,
    x: 10, // 0 + 10
    y: -430, // -750 - 30
  },
  // 8
  {
    width: 80,
    height: 20,
    x: 10, // 0 + 10
    y: -450, // -780 - 20
  },
  // 9 - h-320 and w-20
  {
    width: 15,
    height: 200,
    x: 90, // 0 + 10
    y: -630, // -800 - 200
  },
  // 10 -  New shelf
  {
    width: 60,
    height: 300,
    x: 0,
    y: -1050, //-750 - 300
  },
];
