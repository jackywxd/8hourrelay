"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";

const AccountButton = ({ isMobile }) => {
  const { store } = useAuth();

  if (isMobile) {
    return (
      <div className="py-6">
        <a
          href={store.authStore.isAuthenticated ? `/account` : `/login`}
          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {store.authStore.isAuthenticated ? `Account` : `Log in`}
        </a>
      </div>
    );
  }
  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <a
        href={store.authStore.isAuthenticated ? `/account` : `/login`}
        className="text-sm font-semibold leading-6 text-gray-900  dark:text-gray-100"
      >
        {store.authStore.isAuthenticated ? (
          `Account`
        ) : (
          <>
            Log in <span aria-hidden="true">&rarr;</span>
          </>
        )}
      </a>
    </div>
  );
};

export default observer(AccountButton);
