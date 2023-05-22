"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Loader from "./Loader";

function LayoutMdx({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { store } = useAuth();
  useEffect(() => {
    if (store.error) {
      setTimeout(() => {
        store.resetError();
      }, 5000);
    }
  }, [store.error]);
  return (
    <div className="relative flex justify-center min-h-full grow">
      {/* <!-- loading overlay --> */}
      {store.isLoading && (
        <div className="absolute bg-gray-500 bg-opacity-50 z-10 h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {store.error && (
        <div className="toast">
          <div className="transition-opacity ease-in-out duration-500 delay-300  alert alert-error">
            <div>
              <span>{store.error}</span>
            </div>
          </div>
        </div>
      )}
      {/* <!-- end loading overlay --> */}
      <div className="w-full">{children}</div>
    </div>
  );
}

export default observer(LayoutMdx);
