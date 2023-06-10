import { Select, Option } from "@material-tailwind/react";
import { useField } from "formik";

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
        label={props.selected ? "" : props.label}
        onChange={helpers.setValue}
        disabled={props.disabled}
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
        <p className="mt-2 text-sm text-red-600" id="error">
          {meta.error}
        </p>
      ) : null}
    </div>
  );
}
export default SelectComponent;
