import { DashboardConfig } from "types";

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
      href: "/register",
      icon: "billing",
    },
    {
      title: "My Team",
      href: "/account/myteam",
      icon: "settings",
    },
  ],
};
