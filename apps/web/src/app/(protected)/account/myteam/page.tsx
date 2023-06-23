import ProtectedRoute from "@/components/ProtectedRoute";
import MyTeam from "./MyTeam";

const ProtectedPage = () => {
  return (
    <ProtectedRoute>
      <MyTeam />
    </ProtectedRoute>
  );
};

export default ProtectedPage;
