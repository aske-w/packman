import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { clamp } from 'lodash';
import { RECT_OVERLAP_COLOR, SNAPPING_THRESHOLD, STROKE_WIDTH } from '../config/canvasConfig';
import { ColorRect } from '../types/ColorRect.interface';
import { Coordinate } from '../types/Coordinate.interface';
import { RectangleConfig } from '../types/RectangleConfig.interface';
import { intersects } from '../utils/intersects';
import { Layer as KonvaLayer } from 'konva/lib/Layer';

interface UseSnapProps<T> {
  interactiveLayerRef: React.RefObject<KonvaLayer>;
  inventoryLayer: React.RefObject<KonvaLayer>;
  stripWidth: number;
  scrollableHeight: number;
  inventoryWidth: number;
  gameHeight: number;
  inventory: (T & { fill: string })[];
  inventoryFilterFunc(value: T, target: Shape<ShapeConfig>, index: number): boolean;
}

export const useSnap = <T>({
  inventoryLayer,
  inventoryFilterFunc,
  inventory,
  gameHeight,
  scrollableHeight,
  stripWidth,
  inventoryWidth,
  interactiveLayerRef,
}: UseSnapProps<T>) => {
  const snap = (destination: ColorRect<RectangleConfig>[], target: Shape, overrideXY?: Coordinate) => {
    let intersectsAny = false;
    let { x: targetX, y: targetY, height: targetHeight, width: targetWidth, name: targetName } = target.getAttrs();
    target.moveToTop();
    const stripScrollOffset = interactiveLayerRef.current?.y()!;

    if (overrideXY != undefined) {
      targetX = overrideXY.x;
      targetY = overrideXY.y;
    }

    let cx = targetX;
    let cy = targetY;
    let xDist: number | undefined;
    let yDist: number | undefined;

    if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
      // Snap target's right side to strip's right side
      cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
    } else if (0 + SNAPPING_THRESHOLD > targetX) {
      // Snap target's left side to strip's left side
      cx = 0;
    }

    if (0 + SNAPPING_THRESHOLD > targetY) {
      // Snap target's top to the top of the strip
      if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
        //this is necessary to properly snap in the bottom right corner of the strip when dragging from inventory
        cy = 0;
        cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
      } else {
        cy = 0;
      }
    } else if (scrollableHeight < targetY + targetHeight + STROKE_WIDTH / 2) {
      // Snap target's bottom to the bottom of the strip
      if (stripWidth - SNAPPING_THRESHOLD < targetX + targetWidth && stripWidth + SNAPPING_THRESHOLD > targetX + targetWidth) {
        //this is necessary to properly snap in the bottom right corner of the strip when dragging from inventory
        cx = stripWidth - targetWidth - STROKE_WIDTH / 2;
        cy = gameHeight + -stripScrollOffset - targetHeight;
      } else {
        cy = gameHeight + -stripScrollOffset - targetHeight;
      }
    }

    destination.forEach(f => {
      const { name, x, y, height, width } = f;

      if (name == targetName) return;

      if (
        intersects(f, {
          x: targetX,
          y: targetY,
          height: targetHeight,
          width: targetWidth,
        })
      ) {
        intersectsAny = true;
      } else {
        if (
          x - SNAPPING_THRESHOLD < targetX + targetWidth &&
          targetX + targetWidth < x + SNAPPING_THRESHOLD &&
          y < targetY + targetHeight &&
          y + height > targetY
        ) {
          // Snap target's right side to f's left side
          if (xDist == undefined || xDist > x - targetX + targetWidth) cx = x - targetWidth;
        } else if (
          x + width - SNAPPING_THRESHOLD < targetX &&
          x + width + SNAPPING_THRESHOLD > targetX &&
          y < targetY + targetHeight &&
          y + height > targetY
        ) {
          // Snap target's left side to f's right side
          if (xDist == undefined || xDist > targetX - (x + width)) cx = x + width;
        }
        if (
          y + height - SNAPPING_THRESHOLD < targetY &&
          y + height + SNAPPING_THRESHOLD > targetY &&
          x < targetX + targetWidth &&
          x + width > targetX
        ) {
          // Snap target's top side to f's bottom side
          if (yDist == undefined || yDist > targetY - (y + height)) cy = y + height;
        } else if (
          y + SNAPPING_THRESHOLD > targetY + targetHeight &&
          y - SNAPPING_THRESHOLD < targetY + targetHeight &&
          x < targetX + targetWidth &&
          x + width > targetX
        ) {
          // Snap target's bottom side to f's top side
          if (yDist == undefined || yDist > y - (targetY + targetHeight)) cy = y - targetHeight;
        }
      }
    });

    target.setAbsolutePosition({ x: cx, y: cy + stripScrollOffset });
    if (intersectsAny || targetX < 0 || targetY < 0 || targetY > scrollableHeight) {
      //overlap while dragging
      target.setAttr('fill', RECT_OVERLAP_COLOR);
    } else {
      //no overlap while dragging
      let color = inventory.find((r, i) => inventoryFilterFunc(r, target, i))!.fill;
      target.setAttr('fill', color!.substring(0, 7) + '80');
    }
  };

  const snapInventory = (destination: Group[], target: Shape) => {
    const { x, y } = target.getAttrs();

    // don't try to snap if target is still in the inventory
    if (x > SNAPPING_THRESHOLD) {
      return;
    }

    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    });
    const stripScrollOffset = interactiveLayerRef.current?.y()!;
    const adjustedY = clamp(y + inventoryLayer.current?.y()! - stripScrollOffset, 0, scrollableHeight);
    const adjustedX = clamp(x + stripWidth, 0, stripWidth + inventoryWidth);
    snap(newDestination, target, { x: adjustedX, y: adjustedY });
  };

  const snapInteractive = (destination: Group[], target: Shape) => {
    const newDestination = destination.map(g => {
      const rect: ColorRect<RectangleConfig> = g.getAttrs();
      return rect;
    });

    target.setAttr('x', clamp(target.getAttr('x'), 0, stripWidth - target.getAttr('width')));
    target.setAttr('y', clamp(target.getAttr('y'), 0, scrollableHeight - target.getAttr('height')));
    snap(newDestination, target);
  };

  return { snapInventory, snapInteractive };
};