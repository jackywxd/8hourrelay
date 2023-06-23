import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Profile",
      href: "/account",
    },
    {
      title: "My Races",
      href: "/account/myrace",
    },
    {
      title: "My Team",
      href: "/account/myteam",
    },
  ],
  sidebarNav: [
    {
      title: "Race Entry",
      href: "/race",
      icon: "post",
    },
    {
      title: "Team",
      href: "/team",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
