import { Metadata } from "next";
import Navbar from "../../(marketing)/Navbar";

export const metadata: Metadata = {
  title: "8 Hour Relay/Teams",
  description: "All teams for vancouver 8 hour relay",
};

function TeamsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col w-full">{children}</div>;
}

export default TeamsLayout;
