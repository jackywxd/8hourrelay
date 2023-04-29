"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "ui";

const ProtectedPage: React.FC = () => {
  const {
    store: { authStore },
  } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-fit justify-center items-center">
        <h1>This is a protected page</h1>
        <div className="text-zinc-900">
          <h1>Click below to Enter 2023 8 Hour Relay Adule</h1>
        </div>
        <div className="mt-11 mb-11">
          <Button
            onClick={() => {
              console.log(`loging out!`);
              authStore.logout();
            }}
            text="Register Adult"
          />
        </div>
        <div className="text-zinc-900">
          <h1>Click below to Enter 2023 8 Hour Relay Adule</h1>
        </div>
        <div className="mt-11">
          <Button
            onClick={() => {
              console.log(`loging out!`);
              authStore.logout();
            }}
            text="Register Kids"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedPage;
