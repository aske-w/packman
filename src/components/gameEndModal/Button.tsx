import React from "react";

interface ButtonProps {
    text?: string;
    additionalClasses?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = ({additionalClasses, text, onClick, children}) => {
  return <button
        type="button"
        className={additionalClasses + " modal-button"}
        onClick={onClick}
        >
        {children ?? text}
    </button>;
};

export default Button;
