import { Metadata } from "next";
import TabbedNav from "./TabbedNav";
import ProtectedRoute from "@/components/ProtectedRoute";

const navItems = [
  {
    title: "Profile",
    href: "/account/",
  },
  {
    title: "My Reace",
    href: "/account/myreace/",
  },
  {
    title: "My Team",
    href: "/account/myteam/",
  },
];

function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 w-full items-center">{children}</div>;
}

export default ProfileLayout;
