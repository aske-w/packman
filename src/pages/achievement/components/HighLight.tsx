import classNames from 'classnames';
import React from 'react';

interface HighLightProps {
  text: string;
  value: number | string;
  className?: string;
}
const HighLight: React.FC<HighLightProps> = ({ text, value, className }) => {
  return (
    <div className={classNames('w-32 h-fit rounded-md p-2', className)}>
      <h3 className="font-medium text-gray-100 text-2xl">{value}</h3>
      <small className="text-xs text-gray-200">{text}</small>
    </div>
  );
};

export default HighLight;
