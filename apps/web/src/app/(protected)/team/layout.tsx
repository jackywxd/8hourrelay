import { Metadata } from "next";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: "8 Hour Relay - Teams",
  description: "Teams page for 8 Hour Relay",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="flex flex-col w-full md:w-[1024px] container mx-auto">
      {children}
    </main>
  );
}
