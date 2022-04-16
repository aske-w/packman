import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

type Cb = ((evt: KonvaEventObject<DragEvent>) => boolean) | ((evt: KonvaEventObject<DragEvent>) => Promise<boolean>);

export const useKeepOnMouse = () => {
  const [isDragging, setDragging] = useState(false);

  const dragEndMiddleWare = useCallback(
    async (evt: KonvaEventObject<DragEvent>, cb: Cb, onErr: (evt: KonvaEventObject<DragEvent>) => void) => {
      if (isDragging) {
        return;
      }

      //  If we successfully can drag to interactive we return
      if (await cb(evt)) {
        return;
      }
      // else we place the rect at the cursor and removes the rect when the user clicks
      const rect = evt.target;
      setDragging(true);
      rect.startDrag();

      document.addEventListener(
        'mousedown',
        async () => {
          // Stop dragging events
          rect.stopDrag();
          setDragging(false);
          //   We run our validation again
          const success = await cb(evt);
          if (!success) onErr(evt); // Send rect back to inventory if not valid
        },
        { once: true }
      );
    },
    [isDragging]
  );

  return { dragEndMiddleWare };
};
