import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

interface FiniteNextFitArticleProps {}
const FiniteNextFitArticle: React.FC<FiniteNextFitArticleProps> = ({}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <p>Finite Next fit is the bin packing version of Next Fit Decreasing Height in strip packing.</p>
      <h4>Preparation</h4>
      <p>
        Since this is an{' '}
        <span data-tip="Means the entire input is known beforehand" className="underline decoration-dotted decoration-gray-500 decoration-1 ">
          offline
        </span>{' '}
        algorithm, we know the entire input beforehand. We utilize this to sort it by non-increasing height.
      </p>
      <div className="flex flex-col items-center p-5 bg-gray-700 rounded-lg not-prose">
        <svg width="782" height="158" viewBox="0 0 782 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="126" width="150" height="32" fill="#FBBF24" />
          <rect x="193" y="59" width="78" height="99" fill="#FBBF24" />
          <rect x="314" y="30" width="78" height="128" fill="#FBBF24" />
          <rect x="435" y="109" width="78" height="49" fill="#FBBF24" />
          <rect x="556" y="69" width="26" height="89" fill="#FBBF24" />
          <rect x="625" width="157" height="158" fill="#FBBF24" />
        </svg>

        <p className="mt-5 text-sm text-white">Unsorted input</p>
      </div>
      <div className="flex flex-col items-center p-5 mt-10 bg-gray-700 rounded-lg not-prose">
        <svg width="784" height="158" viewBox="0 0 784 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="157" height="158" fill="#FBBF24" />
          <rect x="200.4" y="30" width="78" height="128" fill="#FBBF24" />
          <rect x="321.8" y="59" width="78" height="99" fill="#FBBF24" />
          <rect x="443.2" y="69" width="26" height="89" fill="#FBBF24" />
          <rect x="512.6" y="109" width="78" height="49" fill="#FBBF24" />
          <rect x="634" y="126" width="150" height="32" fill="#FBBF24" />
        </svg>

        <p className="mt-5 text-sm text-white">Sorted input</p>
      </div>
      <h4>Execution</h4>
      <p>With the sorted data we now take the tallest item from the input. This is placed in the bottom left of the first bin.</p>
      <p>
        The next item is then placed to the right of it. This continues until no more items fit in the bin. Then a new bin is opened and the item is
        placed to the left in that.
      </p>
      <p>This is repeated until the entire input is packed</p>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-5 bg-gray-700 rounded-lg not-prose max-w-min">
          <svg width="820" height="159" viewBox="0 0 820 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="385" height="158" fill="white" />
            <rect x="435" width="385" height="158" fill="white" />
            <rect x="231.5" y="59.5" width="77" height="98" fill="#FBBF24" stroke="black" />
            <rect x="308.5" y="69.5" width="25" height="88" fill="#FBBF24" stroke="black" />
            <rect x="333.5" y="109.5" width="77" height="48" fill="#FBBF24" fill-opacity="0.5" stroke="black" />
            <rect x="435.5" y="110.5" width="77" height="48" fill="#FBBF24" stroke="black" />
            <rect x="512.5" y="127.5" width="149" height="31" fill="#FBBF24" stroke="black" />
            <rect x="156.5" y="30.5" width="77" height="127" fill="#FBBF24" stroke="black" />
            <rect x="0.5" y="0.5" width="156" height="157" fill="#FBBF24" stroke="black" />
          </svg>

          <p className="mt-5 text-sm text-white">Item cannot fit in first bin.</p>
        </div>
      </div>
    </>
  );
};

export default FiniteNextFitArticle;
