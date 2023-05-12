import { Select, Option } from "@material-tailwind/react";
import { useField, Form, FormikProps, Formik } from "formik";

function SelectComponent(props) {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="w-72 pt-2">
      <Select
        {...field}
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        onChange={helpers.setValue}
        disabled={props.disabled}
        label={props.label}
        error={meta.touched && meta.error ? true : false}
      >
        {props.options?.map((option) => {
          return (
            <Option key={option.label} value={option.value}>
              {option.label}
            </Option>
          );
        })}
      </Select>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}
export default SelectComponent;
