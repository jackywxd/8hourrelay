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
      currentUser: store.authStore.currentUser,
    });
    useEffect(() => {
      if (!store.authStore.currentUser) {
        router.push("/login");
      }
    }, [store.authStore.currentUser]);

    return store.authStore.currentUser ? <>{children}</> : null;
  }
);

export default ProtectedRoute;
