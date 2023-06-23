import { Metadata } from "next";

export const metadata: Metadata = {
  title: "8 Hour Relay/Register",
  description: "Vancouver 8 hour relay offical website",
};

function RegisterLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section className="content-container large">{children}</section>;
}

export default RegisterLayout;
