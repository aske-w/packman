import React from "react";
import Logo from "../resources/Logo.svg";

interface NavProps {
  height: number;
}

const Nav: React.FC<NavProps> = ({ height, children }) => {
  return (
    <div
      style={{
        height: `calc(100% - ${height}px)`,
        width: "100%",
      }}
    >
      <nav
        className=" bg-main w-full p-4 border-b border-gray-800"
        style={{ height }}
      >
        <div className="h-full flex flex-row items-center space-x-4 justify-start">
          <img src={Logo} alt="logo" className="" />
          <h1 className="text-white text-2xl font-medium">Packman</h1>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Nav;
