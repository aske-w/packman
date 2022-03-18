import { IRect } from 'konva/lib/types';
import { Dimensions } from '../types/Dimensions.interface';

/**
 * https://greensock.com/forums/topic/18403-prevent-draggables-from-overlapping-with-a-recursive-function/
 * @param target
 * @param src
 * @returns
 */
export function resolveCollision(target: IRect, src: IRect) {
  // get the vectors to check against
  const vX = target.x + target.width / 2 - (src.x + src.width / 2);
  const vY = target.y + target.height / 2 - (src.y + src.height / 2);

  // Half widths and half heights of the objects
  const ww2 = target.width / 2 + src.width / 2;
  const hh2 = target.height / 2 + src.height / 2;

  // if the x and y vector are less than the half width or half height,
  // they we must be inside the object, causing a collision
  if (Math.abs(vX) < ww2 && Math.abs(vY) < hh2) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    const oX = ww2 - Math.abs(vX);
    const oY = hh2 - Math.abs(vY);

    if (oX >= oY) {
      // Top
      if (vY > 0) {
        target.y += oY - 0.5;
      }
      // Bottom
      else {
        target.y -= oY - 2.5;
      }
    } else {
      // Left
      if (vX > 0) {
        target.x += oX - 0.5;
      }
      // Right
      else {
        target.x -= oX - 2.5;
      }
    }
  }
  return target;
}

export function haveIntersection(r1: IRect, r2: IRect): boolean {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

// Math.max(minY, Math.min(oldY - dy, maxY));
