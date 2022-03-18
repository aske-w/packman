import { STROKE_WIDTH } from '../config/canvasConfig';
import { Rectangle } from '../types/Rectangle.interface';

// for x axis: p1 is the leftmost x and p2 is the rightmost x of one element. p3 is the leftmost x and p4 is the rightmost x of another element
// for y axis: p1 is the uppermost y and p2 is the lowermost y of one element. p3 is the uppermost y and p4 is the lowermost y of another element
const overlapsAxis = (p1: number, p2: number, p3: number, p4: number, threshold = 0) => {
  return (
    (p3 >= p1 - threshold && p3 <= p2 + threshold) ||
    (p4 >= p1 - threshold && p4 <= p2 + threshold) ||
    (p1 >= p3 - threshold && p1 <= p4 + threshold) ||
    (p2 >= p3 - threshold && p2 <= p4 + threshold)
  );
};

//subtract and add one to allow squares' edges to be overlapping
export const intersects = (a: Rectangle, b: Rectangle): boolean => {
  return (
    overlapsAxis(a.x, a.x + a.width, b.x + STROKE_WIDTH + 1, b.x + b.width - STROKE_WIDTH - 1) &&
    overlapsAxis(a.y, a.y + a.height, b.y + STROKE_WIDTH + 1, b.y + b.height - STROKE_WIDTH - 1)
  );
};
