import { useRouter } from "next/navigation";
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
        authStore: { currentUser },
        userStore: { user },
      },
    } = useAuth();

    const router = useRouter();
    console.log(`router and user is `, { router, currentUser });
    useEffect(() => {
      if (!currentUser) {
        router.push("/login");
      }
    }, [currentUser]);

    return currentUser ? <>{children}</> : null;
  }
);

export default ProtectedRoute;
