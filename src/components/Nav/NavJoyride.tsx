import React from "react";
import ReactJoyride from "react-joyride";
import useHelpStore from "../../store/help.store";
import { Gamemodes } from "../../types/enums/Gamemodes.enum";

interface NavJoyrideProps {
  gamemode?: Gamemodes
}

const NavJoyride: React.FC<NavJoyrideProps> = ({ gamemode }) => {
  const { gamesJoyrideOpen, setGamesJoyrideOpen } = useHelpStore();
  const steps = [
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
  ];

  // do something extra based on gamemode
  switch (gamemode) {
    case Gamemodes.ONLINE_STRIP_PACKING:
      const newStep = {
        target: ".r-value", 
        content: "Here you can adjust the value R for the algorithm. It determines the threshold for which items should go on the same shelf."
      };
      // insert r-value explainer before level select
      steps.splice(steps.length - 1, 1, newStep, steps[steps.length - 1])
      break;
  
    default:
      break;
  }

  return <ReactJoyride
    continuous
    steps={steps}
    run={gamesJoyrideOpen}
    callback={(data) => {
      const { status } = data;
      if(status == "finished")
        setGamesJoyrideOpen(false);
    }}
  />;
};

export default NavJoyride;
