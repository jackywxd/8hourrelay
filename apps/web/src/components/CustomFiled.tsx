import { Field, ErrorMessage } from "formik";

export const FieldItem = ({ label, fieldName, ...props }) => {
  return (
    <div className="mt-5">
      <Field
        as={CustomInputComponent}
        id={fieldName}
        name={fieldName}
        label={label}
        {...props}
      />
      <ErrorMessage name={fieldName}>
        {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </ErrorMessage>
    </div>
  );
};

export const FieldCheckBox = ({ label, fieldName, ...props }) => {
  return (
    <>
      <Field as={CustomCheckBox} label={label} name={fieldName} {...props} />
      <ErrorMessage name={fieldName}>
        {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </ErrorMessage>
    </>
  );
};

const CustomCheckBox = (props) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer gap-3">
        <span className="label-text">{props.label}</span>
        <input
          type="checkbox"
          checked={props.value}
          placeholder={props.label}
          className="checkbox checkbox-md checkbox-primary"
          {...props}
        />
      </label>
    </div>
  );
};

const CustomInputComponent = (props) => (
  <div className="flex flex-col w-72 items-end mt-5">
    <input
      type="text"
      className="input input-primary w-full h-10 max-w-xs"
      placeholder={props.label}
      {...props}
    />
  </div>
);
