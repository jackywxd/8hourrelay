import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "ui";

const ProtectedPage: React.FC = () => {
  const {
    store: { authStore },
  } = useAuth();
  return (
    <ProtectedRoute>
      <div>
        <h1>This is a protected page</h1>
        <Button
          onClick={() => {
            authStore.logout();
            console.log(`loging out!`);
          }}
          text="Logout"
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedPage;
