import { useState } from 'react';

export const useToggle = () => {
  const [checked, setChecked] = useState(false);

  const updateChecked = (val: boolean) => setChecked(val);

  return { checked, updateChecked };
};
