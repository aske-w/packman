import React, { ChangeEventHandler, RefObject } from "react";

interface RectInputProps {
    value: string | number,
    cssClasses?: string
    reference?: RefObject<HTMLInputElement>,
    readonly?: boolean,
    onChangeHandler?: ChangeEventHandler<HTMLInputElement>
}

const RectInput: React.FC<RectInputProps> = ({value, cssClasses, reference, readonly = false, onChangeHandler}) => {
    return <input className={cssClasses ?? "rect-input"}
                type="text"
                value={value}
                onChange={onChangeHandler}
                readOnly={readonly}
                ref={reference}/>;
};

export default RectInput;
