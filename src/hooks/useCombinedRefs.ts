import React from 'react';

// for more info see: https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd
export function useCombinedRefs<T>(
  ...refs: (React.MutableRefObject<T> | React.ForwardedRef<T> | Function)[]
) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
