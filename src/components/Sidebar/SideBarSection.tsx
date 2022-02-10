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
      <div className={"bg-lightMain text-white px-3 py-2 "}>
        <label className="text-xs uppercase font-normal">{title}</label>
      </div>
      <div className={"p-3 space-y-4 " + className}>{children}</div>
    </>
  );
};

export default SideBarSection;
