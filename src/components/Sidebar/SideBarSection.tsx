import React from "react";

interface SideBarSectionProps {
  title: string;
  className?: string;
}

const SideBarSection: React.FC<SideBarSectionProps> = ({
  title,
  className,
  children,
}) => {
  return (
    <>
      <div
        className={"bg-gray-700 text-white px-3 py-2 "}
        style={{ backgroundColor: "#2E2E31" }}
      >
        <label className="text-sm tracking-wider uppercase font-light">
          {title}
        </label>
      </div>
      <div className={"p-3 space-y-4 " + className}>{children}</div>
    </>
  );
};

export default SideBarSection;
