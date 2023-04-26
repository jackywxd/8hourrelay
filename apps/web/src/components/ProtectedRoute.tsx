import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useEffect, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(
  ({ children }) => {
    const {
      store: {
        authStore: { isAuthenticated },
      },
    } = useAuth();

    const router = useRouter();
    console.log(`router and user is `, { router, isAuthenticated });
    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated]);

    return isAuthenticated ? <>{children}</> : null;
  }
);

export default ProtectedRoute;
