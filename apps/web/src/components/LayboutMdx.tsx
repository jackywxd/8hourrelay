"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

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
      }, 2000);
    }
  }, [store.error]);
  return (
    <div className="relative flex justify-center min-h-full grow">
      {/* <!-- loading overlay --> */}
      {store.isLoading && (
        <div className="absolute bg-gray-500 bg-opacity-50 z-10 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            {/* <span className="text-3xl mr-4">Loading</span> */}
            {/* <!-- loading icon --> */}
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {/* <!-- end loading icon --> */}
          </div>
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
      <div className="w-full lg:w-[800px] flex flex-co justify-center mt-10">
        {children}
      </div>
    </div>
  );
}

export default observer(LayoutMdx);
