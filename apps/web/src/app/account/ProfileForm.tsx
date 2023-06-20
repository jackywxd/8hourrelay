"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function ProfileForm() {
	const { store } = useAuth();
	const [loading, setLoading] = useState(store.userStore.isLoading);
	useEffect(() => {
		if (store.userStore.isLoading) setLoading(true);
		else setLoading(false);
	}, [store.userStore.isLoading]);
	const router = useRouter();
	const initialValues = {
		firstName: store.userStore.user?.firstName ?? "",
		lastName: store.userStore.user?.lastName ?? "",
		preferName: store.userStore.user?.preferName ?? "",
		phone: store.userStore.user?.phone ?? "",
		birthYear: store.userStore.user?.birthYear ?? ""
	};
	const ProfileSchema = Yup.object().shape({
		firstName: Yup.string().max(50, "Too Long!").required("Required"),
		lastName: Yup.string().max(50, "Too Long!").required("Required"),
		preferName: Yup.string(),
		phone: Yup.string(),
		birthYear: Yup.string().required("Required")
	});

	const onSubmit = (values) => {
		console.log(`saveing new values`, values);
		store.userStore.onUpdateUser(values);
	};
	console.log(`isLoading value`, store.userStore.isLoading);
	return (
		<>
			<div>
				<div>
					<h2>Personal Information</h2>
				</div>
				<Formik
					initialValues={initialValues}
					validationSchema={ProfileSchema}
					enableReinitialize
					validate={(values) => {
						console.log(`validating forms data`, { values });
						let errors = {};
						errors = store.userStore.validateForm(values);
						return errors;
					}}
					onSubmit={onSubmit}>
					{(props) => (
						<Form>
							<div className="form-container">
								<div className="input-container read-only">
									<label>
										{" "}
										<span>Email</span>
									</label>
									<div className="value">
										{store.userStore.user?.email}
									</div>
								</div>
								<div className="input-container required">
									<label htmlFor="first-name">
										<span>First name</span>
									</label>
									<input
										value={props.values.firstName}
										onChange={props.handleChange}
										type="text"
										name="firstName"
										id="first-name"
										autoComplete="given-name"
									/>
									<ErrorMessage name="firstName">
										{(msg) => (
											<div className="text-sm text-red-400 error-msg">
												{msg}
											</div>
										)}
									</ErrorMessage>
								</div>

								<div className="input-container required">
									<label htmlFor="last-name">
										<span>Last name</span>
									</label>
									<input
										value={props.values.lastName}
										onChange={props.handleChange}
										type="text"
										name="lastName"
										id="last-name"
										autoComplete="family-name"
									/>
									<ErrorMessage name="lastName">
										{(msg) => (
											<div className="text-sm text-red-400 error-msg">
												{msg}
											</div>
										)}
									</ErrorMessage>
								</div>

								<div className="input-container">
									<label htmlFor="phone">
										<span>Phone</span>
									</label>

									<input
										value={props.values.phone}
										onChange={props.handleChange}
										id="phone"
										name="phone"
										type="text"
										autoComplete="email"
									/>

									<ErrorMessage name="phone">
										{(msg) => (
											<div className="text-sm text-red-400 error-msg">
												{msg}
											</div>
										)}
									</ErrorMessage>
								</div>

								<div className="input-container">
									<label htmlFor="preferName">
										<span>Preferred Name</span>
									</label>
									<input
										value={props.values.preferName}
										onChange={props.handleChange}
										type="text"
										name="preferName"
										id="preferName"
										autoComplete="username"
									/>
								</div>
								<div className="input-container required">
									<label htmlFor="birthYear">
										<span>Year of Birth</span>
									</label>
									<input
										value={props.values.birthYear}
										onChange={props.handleChange}
										type="text"
										name="birthYear"
										id="birthYear"
										autoComplete="username"
									/>
									<ErrorMessage name="birthYear">
										{(msg) => (
											<div className="text-sm text-red-400 error-msg">
												{msg}
											</div>
										)}
									</ErrorMessage>
								</div>
							</div>

							<div className="button-container mt-10 mb-20">
								<button
									type="submit"
									onClick={() => {
										store.authStore.logout();
										router.push("/");
									}}
									className="btn btn-large btn-light-darkbg">
									Log Out
								</button>
								<button
									disabled={loading ? true : false}
									type="submit"
									className="btn btn-large btn-primary blue">
									{loading ? (
										<span className="loading loading-spinner"></span>
									) : (
										`Save`
									)}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>

			{/* <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 ">Delete account</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>

        <form className="md:col-span-2">
          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-full w-full bg-red-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-red-400"
            >
              Yes, delete my account
            </button>
          </div>
        </form>
      </div> */}
		</>
	);
}

export default observer(ProfileForm);
