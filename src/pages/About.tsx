import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/solid';
interface AboutProps {}

const About: React.FC<AboutProps> = ({}) => {
  return (
    <div className="relative w-full h-full min-h-screen p-10 bg-gradient-to-b from-gray-700 to-gray-800 ">
      <div className="prose prose-invert">
        <a className="text-lg no-underline" href="/">
          <ArrowLeftIcon className="inline w-6 h-6 mr-2" />
          Go Back
        </a>

        <h1 className="mt-10">About</h1>

        <p>This website was created as part of a bachelor's thesis from the IT-university of Copenhagen, 2022.</p>
        <p>
          The full source code is available on Github: <a href="https://github.com/aske-w/packman">Packman</a>
        </p>
        <h3>Creators</h3>
        <ul>
          <li>
            Aske Wachs (<a href="https://github.com/aske-w">Github</a>)
          </li>
          <li>
            Alexander Wermuth (<a href="https://github.com/xWermuth">Github</a>)
          </li>
          <li>
            Jacob Mølby (<a href="https://github.com/jacobmolby">Github</a>)
          </li>
        </ul>
        <h3>Paper</h3>
        <p>
          View the paper here: <i>not available yet</i>
        </p>
      </div>
    </div>
  );
};

export default About;
