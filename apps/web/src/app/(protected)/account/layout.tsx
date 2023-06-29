import { Metadata } from "next";
import { dashboardConfig } from "@/config/dashboard";
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
    <div className="flex flex-col w-full md:w-[1024px] container mx-auto">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden md:w-[800px]">
          {children}
        </main>
      </div>
    </div>
  );
}
