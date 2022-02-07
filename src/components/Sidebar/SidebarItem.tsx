import React from "react";

interface SideBarItemProps {
  text: string;
  element: JSX.Element;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ text, element }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <label className="text-white tracking-wide font-normal text-base">
        {text}
      </label>
      {element}
    </div>
  );
};

export default SideBarItem;
