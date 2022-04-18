import React from "react";
import ReactJoyride from "react-joyride";
import useHelpStore from "../../store/help.store";
import { Gamemodes, PlaygroundGamemodes } from "../../types/enums/Gamemodes.enum";

interface JoyrideProps {
  playground: PlaygroundGamemodes
}

const Joyride: React.FC<JoyrideProps> = ({ playground }) => {
  const { playgroundJoyrideOpen, setPlaygroundJoyrideOpen } = useHelpStore();
  let canvasConfigText: string;
  switch (playground) {
    case Gamemodes.STRIP_PACKING:
      canvasConfigText = 'Here you can choose how wide the strip should be';
      break;
    case Gamemodes.BIN_PACKING:
      canvasConfigText = "Here you can choose the dimensions of the bins and whether to retain the ratio between width and height";
      break;
  
    default:
      throw new Error("canvasConfigText not configured for playground gamemode " + playground);
  }

  return <ReactJoyride
    run={playgroundJoyrideOpen}
    callback={(data) => {
      const { status } = data;
      if(status == "finished")
        setPlaygroundJoyrideOpen(false);
    }}
    steps={[
      {
        content: "Here you can select which algorithm that you're visualizing.",
        target: '.playground-algo-select',
      },
      {
        content: "This toggle allows you to enable 'auto place', which makes the algorithm continuously packing rectangles.",
        target: '.playground-auto-place',
      },
      {
        content: 'This buttons resets the algorithm and removes all test data that has been entered.',
        target: '.playground-reset',
      },
      {
        content: 'Use this button to start the visualization. After it has been clicked you use it to progress the visualization.',
        target: '.playground-start',
      },
      {
        content: canvasConfigText,
        target: '.playground-dimensions',
      },
      {
        content: 'Here you can auto generate test data',
        target: '.playground-auto-gen',
      },
      {
        content: 'This button populates the test data, with what was previously used. This is useful for comparing to algorithms.',
        target: '.playground-prev-data',
      },
      {
        content: 'This button opens the advanced input designer. The designer allows you to more efficiently manipulate your data set.',
        target: '.playground-input-designer',
      },
      {
        content: 'In this section you can add, remove or modify the test data. Just press enter to add it to the data set',
        target: '.playground-test-data',
      },
    ]}
    continuous
  />;
};

export default Joyride;
