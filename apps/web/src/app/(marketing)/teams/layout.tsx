import { Metadata } from "next";
import Navbar from "../Navbar";

export const metadata: Metadata = {
  title: "8 Hour Relay/Teams",
  description: "Vancouver 8 hour relay offical website",
};

function TeamsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <Navbar changeBg />
      {children}
    </div>
  );
}

export default TeamsLayout;
