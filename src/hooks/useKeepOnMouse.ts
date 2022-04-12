import { useCallback, useEffect, useState } from 'react';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';

interface Props {
  stageRef: KonvaStage;
}

export const useKeepOnMouse = ({ stageRef }: Props) => {
  const [isDragging, setDragging] = useState(false);

  const dragEndMiddleWare = useCallback(
    (evt: KonvaEventObject<DragEvent>, cb: (evt: KonvaEventObject<DragEvent>) => boolean, onErr: (evt: KonvaEventObject<DragEvent>) => void) => {
      if (isDragging) {
        console.log('isDragging');
        return;
      }

      //  If we successfully can drag to interactive we return
      if (cb(evt)) {
        return;
      }
      // else we place the rect at the cursor and removes the rect when the user clicks
      const rect = evt.target;
      setDragging(true);
      rect.startDrag();

      document.addEventListener(
        'mousedown',
        () => {
          // Stop dragging events
          rect.stopDrag();
          setDragging(false);
          //   We run our validation again
          const success = cb(evt);
          if (!success) onErr(evt); // Send rect back to inventory if not valid
        },
        { once: true }
      );
    },
    [stageRef, isDragging]
  );

  return { dragEndMiddleWare };
};
