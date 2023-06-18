import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useField } from "formik";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

function SelectComponent(props) {
  const [field, meta, helpers] = useField(props);
  // if (props.defaultValue) helpers.setValue(props.defaultValue);
  return (
    <div className="w-72 mt-5">
      <Listbox
        {...field}
        value={meta.value}
        onChange={helpers.setValue}
        disabled={props.disabled}
      >
        <div className="relative mt-1">
          <Listbox.Button
            className={clsx(
              "relative w-full h-10 cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
              props.disabled && "opacity-30"
            )}
          >
            <span
              className={clsx("block truncate", !meta.value && "text-gray-300")}
            >
              {props.defaultValue && props.disabled
                ? props.defaultValue
                : meta.value
                ? props.options.filter((o) => o.value === meta.value)[0]?.label
                : props.label}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {props.options?.map((option) => {
                return (
                  <Listbox.Option
                    key={option.label}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {meta.touched && meta.error ? (
        <Listbox.Label className="mt-2 text-sm text-red-600" id="error">
          {meta.error}
        </Listbox.Label>
      ) : null}
    </div>
  );
}
export default SelectComponent;
