import { Metadata } from "next";
import { dashboardConfig } from "@/config/dashboard";
import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-account-nav";
import Footer from "@/components/ui/Footer/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Your 8 hour relay account settings",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col space-y-6">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav items={dashboardConfig.mainNav} />
            <UserAccountNav />
          </div>
        </header>
        <div className="flex-1 container mx-auto">
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
        <Footer className="border-t px-10" />
      </div>
    </AuthProvider>
  );
}
