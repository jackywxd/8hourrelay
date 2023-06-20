"use client";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import AccountPage from "./AccountPage";
import "@/styles/form.css";

const ProtectedPage = async () => {
	// user logged in and authStore has been fullfilled with user data
	return (
		<section>
			<Suspense fallback={Loader}>
				<AccountPage />
			</Suspense>
		</section>
	);
};

export default ProtectedPage;
