import React from "react";
import ReactJoyride from "react-joyride";
import { Gamemodes } from "../../types/Gamemodes.enum";

interface NavJoyrideProps {
    gamemode: Gamemodes
}

const NavJoyride: React.FC<NavJoyrideProps> = ({ gamemode }) => {
  return <ReactJoyride
    continuous
    steps={[
        {
        target: '.user-score',
        content: 'This is your score.',
        },
        {
        target: '.algorithm-score',
        content: 'This is the score of the algorithm.',
        },
        {
        target: '.rects-left',
        content: 'Here you can see how much of your inventory, you still need to pack.',
        },
        {
        target: '.algorithm-select',
        content: 'Here you can choose which algorithm you play against.',
        },
        {
        target: '.level-select',
        content: 'Here you can choose which difficulty level you play at.',
        },
    ]}
    />;
};

export default NavJoyride;
