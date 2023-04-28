import { MDXRemote } from "next-mdx-remote/rsc";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="flex justify-center bg-white">{children}</div>;
}
