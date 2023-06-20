"use client";
import { useEffect, useState, useTransition } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { sendMessage } from "./sendMsgActions";
const init = {
	name: "",
	email: "",
	messages: ""
};
function MessageForm() {
	const [pending, startTransition] = useTransition();
	const [initialValues, setInitialValues] = useState(init);
	const [success, setSuccess] = useState(false);
	const MessageSchema = Yup.object().shape({
		name: Yup.string().max(50, "Too Long!").required("Required"),
		email: Yup.string().email().required("Required"),
		messages: Yup.string().required("Required")
	});

	useEffect(() => {
		if (success && !pending) setInitialValues(init);
	}, [success, pending]);

	const onSubmit = async (values, action) => {
		if (pending || success) {
			action.resetForm();
			return;
		}
		startTransition(async () => {
			await sendMessage(values);
			setSuccess(true);
			action.resetForm();
		});
	};
	return (
		<div className="content-container large text-white">
			<div className="contact-deck">
				Have question? Need some help?
				<p className="description">
					Send us messages and we will get back to you shortly.
				</p>
			</div>

			<Formik
				initialValues={initialValues}
				validationSchema={MessageSchema}
				enableReinitialize
				onSubmit={onSubmit}>
				{(props) => (
					<Form>
						<div className="form-container">
							<div className="input-container">
								<label htmlFor="first-name">
									<span>Name</span>
								</label>
								<input
									value={props.values.name}
									onChange={props.handleChange}
									type="text"
									name="name"
									id="first-name"
								/>
								<ErrorMessage name="name">
									{(msg) => (
										<div className="ml-2 text-sm text-red-400 error-msg">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							<div className="input-container">
								<label htmlFor="email">
									<span>Email</span>
								</label>

								<input
									value={props.values.email}
									onChange={props.handleChange}
									type="text"
									name="email"
									id="email"
								/>

								<ErrorMessage name="email">
									{(msg) => (
										<div className="ml-2 text-sm text-red-400 error-msg">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							<div className="input-container textarea span-2">
								<label htmlFor="messages">
									<span>Messages</span>
								</label>
								<textarea
									value={props.values.messages}
									onChange={props.handleChange}
									id="messages"
									name="messages"
								/>

								<ErrorMessage name="messages">
									{(msg) => (
										<div className="ml-2 text-sm text-red-400 error-msg">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>
						</div>

						<div className="button-container mt-5 mb-20">
							<button className="btn btn-large btn-primary blue">
								{pending ? (
									<span className="loading loading-ring loading-md"></span>
								) : success ? (
									`Sent successfully`
								) : (
									`Send`
								)}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default MessageForm;
