import Loader from "@/components/Loader";
import { Suspense } from "react";
import AccountPage from "./AccountPage";

const ProtectedPage = async () => {
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex pt-10 items-center">
      <Suspense fallback={Loader}>
        <AccountPage />
      </Suspense>
    </div>
  );
};

export default ProtectedPage;
