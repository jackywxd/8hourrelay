import { Metadata } from "next";
import { dashboardConfig } from "@/config/dashboard";
import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-account-nav";
import Footer from "@/components/ui/Footer/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardNav } from "@/components/nav";

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
    <div className="container flex min-h-screen flex-col space-y-6 w-full md:w-[1024px] mx-auto">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
      <Footer className="border-t" />
    </div>
  );
}
