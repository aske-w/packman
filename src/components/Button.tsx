import classNames from 'classnames';
import React from 'react';

interface ButtonProps {
  text: string;
  onClick(): void;
  disabled?: boolean;
  className?: string | false;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled, className = 'bg-blue-600 hover:bg-blue-700' }) => {
  return (
    <button className={classNames('px-2 py-1 font-medium text-white rounded shadow', className)} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
