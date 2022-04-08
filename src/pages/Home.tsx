import React from 'react';
import { Link } from 'react-router-dom';
import { pathName } from './routes';
import Logo from '../../src/resources/Logo.svg';
interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div className="w-screen p-10 bg-gradient-to-b from-gray-700 to-gray-800 backdrop-blur backdrop-filter">
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="logo" className="w-20 h-20" />
          <h1 className="text-6xl font-extrabold tracking-wide text-white">
            Packman <span className="text-sm font-normal tracking-normal">by Learnpacking.com</span>
          </h1>
        </div>
        <p className="max-w-xl mt-5 text-lg font-medium text-white">
          Welcome to Packman! Here you can challenge yourself within the world of two-dimensional packing. Learn about the different algorithms in the
          playgrounds and take your newfound knowledge with you and beat the algorithms.
        </p>
      </div>
      <div className="flex items-start justify-around mt-12">
        <div className="flex flex-col space-y-12">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-white">Playground</h2>
            <p className="!mt-0 text-sm font-light text-gray-100">Visualization and learning</p>
            <Link to={pathName.STRIP_PLAYGROUND}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Strip Packing</h3>
                <p className="text-sm text-gray-800">Learn and visualize different offline strip packing algorithms.</p>
              </div>
            </Link>
            <Link to={pathName.BIN_PLAYGROUND}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Bin Packing</h3>
                <p className="text-sm text-gray-800">Learn and visualize different bin packing algorithms.</p>
              </div>
            </Link>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-white">Extra</h2>
            <p className="!mt-0 text-sm font-light text-gray-100">All the other stuff</p>

            <Link to={pathName.ACHIEVEMENTS}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Achievements and stats</h3>
                <p className="text-sm text-gray-800">Check out your progress.</p>
              </div>
            </Link>
            <Link to={pathName.ABOUT}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">About</h3>
                <p className="text-sm text-gray-800">Learn more about the website.</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-white">Games</h2>
          <p className="!mt-0 text-sm font-light text-gray-100">Test your skills</p>

          <Link to={pathName.STRIP_GAME}>
            <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 ">Offline Strip Packing</h3>
              <p className="text-sm text-gray-800">Use the least amount of height and beat your opponent.</p>
            </div>
          </Link>
          <Link to={pathName.ONLINE_STRIP_GAME}>
            <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 ">Online Strip Packing</h3>
              <p className="text-sm text-gray-800">You can only see a few items at a time, but the opponent can see non!</p>
            </div>
          </Link>
          <Link to={pathName.BIN_GAME}>
            <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/90 hover:bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 ">Bin Packing</h3>
              <p className="text-sm text-gray-800">You have to use the least amount of bins.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
