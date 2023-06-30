import React from "react";
import { useField } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

function SelectComponent(props) {
  const [field, meta, helpers] = useField(props);
  // if (props.defaultValue) helpers.setValue(props.defaultValue);
  return (
    <div className="w-72 mt-5">
      <Label htmlFor={props.name}>{props.label}</Label>
      <Select value={meta.value} onValueChange={helpers.setValue} {...props}>
        <SelectTrigger id={props.name}>
          <SelectValue placeholder={props.label} />
        </SelectTrigger>
        <SelectContent>
          {props.options?.map((option) => {
            return (
              <SelectItem value={option.value} key={option.label}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {meta.touched && meta.error ? (
        <p className="text-xs text-red-600 error-msg" id="error">
          {meta.error}
        </p>
      ) : null}
    </div>
  );
}
export default SelectComponent;
