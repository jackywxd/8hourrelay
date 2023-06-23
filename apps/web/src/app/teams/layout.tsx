import { Metadata } from "next";

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
    <section className="padding-large content-container large m-auto">
      {children}
    </section>
  );
}

export default TeamsLayout;
