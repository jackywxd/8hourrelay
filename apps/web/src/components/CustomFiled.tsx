import { cn } from "@/lib/utils";
import { Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";

export const FieldItem = ({ label, fieldName, ...props }) => {
  return (
    <div className="mt-5 w-full">
      <Field
        as={CustomInputComponent}
        id={fieldName}
        name={fieldName}
        label={label}
        {...props}
      />
      <ErrorMessage name={fieldName}>
        {(msg) => <p className="px-1 text-xs text-red-600 error-msg">{msg}</p>}
      </ErrorMessage>
    </div>
  );
};

export const FieldCheckBox = ({ label, fieldName, ...props }) => {
  return (
    <>
      <Field
        as={CustomCheckBox}
        label={label ?? undefined}
        name={fieldName}
        {...props}
      />
      <ErrorMessage name={fieldName}>
        {(msg) => (
          <label className="block text-sm font-medium text-red-400 error-msg">
            {msg}
          </label>
        )}
      </ErrorMessage>
    </>
  );
};

const CustomCheckBox = (props) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer gap-3">
        <input
          type="checkbox"
          checked={props.value}
          placeholder={props.label}
          {...props}
        />
      </label>
    </div>
  );
};

const CustomInputComponent = (props) => {
  return (
    <div className="grid gap-1">
      <Label htmlFor={props.label} className="bloack text-sm">
        <span>{props.label}</span>
      </Label>
      <Input type="text" {...props} />
    </div>
  );
};
