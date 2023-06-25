import { DashboardConfig } from "@/types/index";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Account",
      href: "/account",
    },
    {
      title: "Registration",
      href: "/register",
    },
  ],
  sidebarNav: [
    {
      title: "Profile",
      href: "/account",
      icon: "settings",
    },
    {
      title: "My Race",
      href: "/account/myrace",
      icon: "trophy",
    },
    {
      title: "My Team",
      href: "/account/myteam",
      icon: "users",
    },
  ],
};
