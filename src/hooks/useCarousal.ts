import { createRef, useState } from 'react';

export const useCarousal = <T>(vals: T[]) => {
  const [curr, setCurr] = useState(0);
  const total = vals.length;

  const refs = vals.reduce<React.RefObject<HTMLDivElement>[]>((acc, mode, i) => {
    acc[i] = createRef<HTMLDivElement>();
    return acc;
  }, []);

  const scrollToImage = (i: number) => {
    // First let's set the index of the image we want to see next
    setCurr(i);
    // Now, this is where the magic happens. We 'tagged' each one of the images with a ref,
    // we can then use built-in scrollIntoView API to do eaxactly what it says on the box - scroll it into
    // your current view! To do so we pass an index of the image, which is then use to identify our current
    // image's ref in 'refs' array above.
    refs[i].current?.scrollIntoView({
      //     Defines the transition animation.
      behavior: 'smooth',
      //      Defines vertical alignment.
      block: 'nearest',
      //      Defines horizontal alignment.
      inline: 'start',
    });
  };

  const nextItem = () => {
    if (curr >= total - 1) {
      scrollToImage(0);
    } else {
      scrollToImage(curr + 1);
    }
  };

  const previousItem = () => {
    if (curr === 0) {
      scrollToImage(total - 1);
    } else {
      scrollToImage(curr - 1);
    }
  };

  return { refs, nextItem, previousItem, activeItem: vals[curr] };
};
