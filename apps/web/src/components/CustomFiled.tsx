import { cn } from "@/lib/utils";
import { Field, ErrorMessage } from "formik";

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
				{(msg) => (
					<div className="text-sm text-red-400 error-msg">{msg}</div>
				)}
			</ErrorMessage>
		</div>
	);
};

export const FieldCheckBox = ({ label, fieldName, ...props }) => {
	return (
		<>
			<Field
				as={CustomCheckBox}
				label={label?? undefined}
				name={fieldName}
				{...props}
			/>
			<ErrorMessage name={fieldName}>
				{(msg) => (
					<label className="block text-sm font-medium text-red-400 error-msg">{msg}</label>
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
	console.log(`props`, props)
	return (
	<div className={cn("input-container", props?.value && "has-value", props.required && "required")}>
		<label htmlFor={props.label} className="block text-sm"><span>{props.label}</span></label>
		<input
			type="text"
			{...props}
		/>
	</div>
)};
