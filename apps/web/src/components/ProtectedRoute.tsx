"use client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useEffect, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

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
    useEffect(() => {
      if (!store.authStore.isAuthenticated) {
        router.push("/login");
      }
    }, [store.authStore.isAuthenticated]);

    return store.authStore.isAuthenticated ? <>{children}</> : null;
  }
);

export default ProtectedRoute;
