import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";

interface SelectProps<T = string> {
  value: T;
  onChange: (val: T) => void;
  readonly options: T[];
  className?: string;
  innerClassname?: string;
  selectIconClass?: string;
  disabled?: boolean;
}

function Select<T>({
  value,
  onChange,
  options,
  disabled,
  selectIconClass = "w-5 h-5 text-gray-400",
  innerClassname = "bg-canvas",
  className,
}: SelectProps<T>) {
  return (
    <div className={classNames("relative", className)}>
      {disabled && (
        <div className="absolute z-50 w-full h-full bg-gray-700 rounded-lg opacity-70"></div>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={classNames(
              "relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500",
              innerClassname
            )}
          >
            <span
              className={`block truncate ${disabled ? "text-gray-400" : ""}`}
            >
              {value}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className={selectIconClass} aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}
                              cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {option}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? "text-amber-600" : "text-amber-600"
                          }
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default Select;
