"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import LoginFirst from "@/components/LoginFirst";
import { registerStore } from "@8hourrelay/store";

function LayoutSecure({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { store } = useAuth();
  // registerStore.attachedUserStore(store.userStore);

  return (
    <div className="relative flex justify-center w-full min-h-full grow">
      {store.authStore.isAuthenticated ? (
        <div className="flex justify-center w-full md:w-[800px]">
          {children}
        </div>
      ) : (
        <LoginFirst />
      )}
    </div>
  );
}

export default observer(LayoutSecure);
