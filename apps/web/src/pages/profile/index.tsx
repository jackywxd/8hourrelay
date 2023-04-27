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
        <h1>Click below to Enter 2023 8 Hour Relay</h1>
        <Button
          onClick={() => {
            console.log(`loging out!`);
            authStore.logout();
          }}
          text="Logout"
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedPage;
