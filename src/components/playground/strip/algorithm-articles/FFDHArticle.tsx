import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

interface FFDHArticleProps {}
const FFDHArticle: React.FC<FFDHArticleProps> = ({}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <p>
        First fit decreasing height is one of the first strip packing
        algorithms.
      </p>
      <h4>Preparation</h4>
      <p>
        Since this is an{' '}
        <span
          data-tip="Means the entire input is known beforehand"
          className="underline decoration-dotted decoration-gray-500 decoration-1 ">
          offline
        </span>{' '}
        algorithm, we know the entire input beforehand. We utilize this to sort
        it by non-increasing height.
      </p>
      <div className="flex flex-col items-center p-5 bg-gray-700 rounded-lg not-prose">
        <svg
          width="792"
          height="158"
          viewBox="0 0 792 158"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect y="126" width="150" height="32" fill="#FBBF24" />
          <rect x="170" y="59" width="78" height="99" fill="#FBBF24" />
          <rect x="268" y="30" width="78" height="128" fill="#FBBF24" />
          <rect x="366" y="109" width="78" height="49" fill="#FBBF24" />
          <rect x="464" width="157" height="158" fill="#FBBF24" />
          <rect x="641" y="139" width="105" height="19" fill="#FBBF24" />
          <rect x="766" y="69" width="26" height="89" fill="#FBBF24" />
        </svg>

        <p className="mt-5 text-sm text-white">Unsorted input</p>
      </div>
      <div className="flex flex-col items-center p-5 mt-10 bg-gray-700 rounded-lg not-prose">
        <svg
          width="784"
          height="158"
          viewBox="0 0 784 158"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect width="157" height="158" fill="#FBBF24" />
          <rect x="175.667" y="30" width="78" height="128" fill="#FBBF24" />
          <rect x="272.333" y="59" width="78" height="99" fill="#FBBF24" />
          <rect x="369" y="69" width="26" height="89" fill="#FBBF24" />
          <rect x="413.667" y="109" width="78" height="49" fill="#FBBF24" />
          <rect x="510.333" y="126" width="150" height="32" fill="#FBBF24" />
          <rect x="679" y="139" width="105" height="19" fill="#FBBF24" />
        </svg>

        <p className="mt-5 text-sm text-white">Sorted input</p>
      </div>
      <h4>Execution</h4>
      <p>
        With the sorted data we now take the tallest rectangle from the input.
        This is placed in the bottom left of the strip. We have now started a
        new shelf with the height of the first placed rectangle.
      </p>
      <p>
        When placing the next rectangle, we now look at the bottom most shelf.
        We check that the remaining width of the shelf is enough to accomodate
        the rectangle. This leads to two cases:
      </p>
      <ol>
        <li>
          If there is enough space, the rectangle is placed in the same shelf
        </li>
        <li>
          Otherwise, we check the shelf above to see if it can accomodate the
          rectangle. If it can it will be placed. Otherwise we continue checking
          all shelves above, if none can accomodate it, we create a new shelf
          and it is placed there.
        </li>
      </ol>
      <p>This is repeated until the entire input is packed</p>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-5 bg-gray-700 rounded-lg not-prose max-w-min">
          <svg
            width="563"
            height="319"
            viewBox="0 0 563 319"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect width="554" height="319" fill="white" />
            <rect
              x="231.5"
              y="220.5"
              width="77"
              height="98"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="309.5"
              y="230.5"
              width="25"
              height="88"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="335.5"
              y="270.5"
              width="77"
              height="48"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="413.5"
              y="287.5"
              width="149"
              height="31"
              fill="#FBBF24"
              fill-opacity="0.5"
              stroke="black"
            />
            <rect
              x="156.5"
              y="191.5"
              width="77"
              height="127"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="0.5"
              y="161.5"
              width="156"
              height="157"
              fill="#FBBF24"
              stroke="black"
            />
            <line
              x1="2"
              y1="160"
              x2="554"
              y2="160"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
          </svg>
          <p className="mt-5 text-sm text-white">
            Rectangle cannot fit on the first shelf.
          </p>
        </div>
        <div className="flex flex-col items-center self-center p-5 mt-5 bg-gray-700 rounded-lg not-prose max-w-min">
          <svg
            width="554"
            height="319"
            viewBox="0 0 554 319"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect width="554" height="319" fill="white" />
            <rect
              x="231.5"
              y="220.5"
              width="77"
              height="98"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="309.5"
              y="230.5"
              width="25"
              height="88"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="335.5"
              y="270.5"
              width="77"
              height="48"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="0.5"
              y="129.5"
              width="149"
              height="31"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="156.5"
              y="191.5"
              width="77"
              height="127"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="0.5"
              y="161.5"
              width="156"
              height="157"
              fill="#FBBF24"
              stroke="black"
            />
            <line
              x1="2"
              y1="160"
              x2="554"
              y2="160"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
            <line
              x1="2"
              y1="128"
              x2="554"
              y2="128"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
          </svg>
          <p className="mt-5 text-sm text-white">
            A new shelf is created to fit the rectangle.
          </p>
        </div>
        <div className="flex flex-col items-center self-center p-5 mt-5 bg-gray-700 rounded-lg not-prose max-w-min">
          <svg
            width="554"
            height="319"
            viewBox="0 0 554 319"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect width="554" height="319" fill="white" />
            <rect
              x="413.5"
              y="300.5"
              width="104"
              height="18"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="231.5"
              y="220.5"
              width="77"
              height="98"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="309.5"
              y="230.5"
              width="25"
              height="88"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="335.5"
              y="270.5"
              width="77"
              height="48"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="0.5"
              y="129.5"
              width="149"
              height="31"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="156.5"
              y="191.5"
              width="77"
              height="127"
              fill="#FBBF24"
              stroke="black"
            />
            <rect
              x="0.5"
              y="161.5"
              width="156"
              height="157"
              fill="#FBBF24"
              stroke="black"
            />
            <line
              x1="2"
              y1="160"
              x2="554"
              y2="160"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
            <line
              x1="2"
              y1="128"
              x2="554"
              y2="128"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
          </svg>

          <p className="mt-5 text-sm text-white">
            The last rectangle fits in the bottom shelf.
          </p>
        </div>
      </div>
    </>
  );
};

export default FFDHArticle;
