import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { PackingAlgorithms } from "../types/PackingAlgorithm.interface";

interface AlgoSelectProps<T = PackingAlgorithms> {
  value: T;
  onChange: (val: T) => void;
  readonly options: T[];
  className?: string;
  disabled?: boolean;
}

const AlgoSelect: React.FC<AlgoSelectProps> = ({
  value,
  onChange,
  options,
  disabled,
  className,
}) => {
  return (
    <div className={"relative " + className}>
      {disabled && (
        <div className="w-full h-full absolute bg-gray-50 opacity-70 rounded-lg z-50"></div>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            style={{ backgroundColor: "#383838" }}
            className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500"
          >
            <span
              className={`block truncate ${disabled ? "text-gray-400" : ""}`}
            >
              {value}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
};

export default AlgoSelect;
