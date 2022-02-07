import React from "react";

interface CardProps {
  className?: string;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return <div className={className + " rounded-md"}>{children}</div>;
};

export default Card;
