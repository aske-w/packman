import React from 'react';
import { useToggle } from '../hooks/useToggle';
import Toggle from './Toggle';

interface Props {}

const Actions: React.FC<Props> = () => {
  const { checked, updateChecked } = useToggle();
  return null;
  //   return (
  //     <div>
  //       <Toggle checked={checked} onClick={updateChecked} label="Something" />
  //       {checked ? null : ( // Show controls
  //         <button
  //           disabled={isFinished}
  //           onClick={placeNext}
  //           className="px-2 py-1 font-medium text-white bg-blue-500 rounded shadow">
  //           {isFinished ? "you're done" : 'Next!'}
  //         </button>
  //       )}
  //     </div>
  //   );
};

export default Actions;
