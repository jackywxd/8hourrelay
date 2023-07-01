import { Metadata } from "next";
import Navbar from "../../(marketing)/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "8 Hour Relay/Teams",
  description: "All teams for vancouver 8 hour relay",
};

function TeamsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={"flex flex-col min-h-screen w-full items-center bg-[#00356a]"}
    >
      <div className="flex flex-col w-full flex-1">
        <div className="flex flex-col flex-1 w-full flex-grow">{children}</div>
        <div className="flex flex-col self-end w-full">
          <div className="container mx-auto text-white">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
  return <div className="flex flex-col w-full bg-[#00356a]">{children}</div>;
}

export default TeamsLayout;
