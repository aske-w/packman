import React from 'react';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ className, style, children }) => {
  return (
    <div className={className + ' rounded'} style={style}>
      {children}
    </div>
  );
};

export default Card;
