import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Teams",
  description: "Your 8 hour relay my teams settings",
};

function TeamLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 w-full">{children}</div>;
}

export default TeamLayout;
