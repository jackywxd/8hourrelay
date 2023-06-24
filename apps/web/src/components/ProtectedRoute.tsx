"use client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useEffect, ReactNode, useTransition } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(
  ({ children }) => {
    const { store } = useAuth();
    const router = useRouter();
    console.log(`router and user is `, {
      router,
      isAuthenticated: store.authStore.isAuthenticated,
    });

    console.log(`this is protected route!!`);

    // useEffect(() => {
    //   if (!store.authStore.isAuthenticated) {
    //     router.push("/login");
    //   }
    // }, [store.authStore.isAuthenticated]);

    return store.authStore.isAuthenticated ? (
      <>{children}</>
    ) : (
      <div className="flex w-full mx-auto p-10">
        <Loading />
      </div>
    );
  }
);

export default ProtectedRoute;
