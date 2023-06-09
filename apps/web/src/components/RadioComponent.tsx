import { useField } from "formik";

function RadioComponent(props) {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="w-72 pt-2">
      {props.options?.map((option) => {
        return (
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{option.label}</span>
              <input
                type="radio"
                name={field.name}
                className="radio"
                checked={field.value}
                {...props}
              />
            </label>
          </div>
        );
      })}
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}
export default RadioComponent;
