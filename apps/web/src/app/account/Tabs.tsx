import React from "react";
import {
  TrophyIcon,
  UserGroupIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

const Tabs = [
  {
    label: "Profle",
    icon: () => <UserCircleIcon className="h-5 w-5" />,
  },
  {
    label: "My Race",
    icon: () => <TrophyIcon className="h-5 w-5" />,
  },
  // {
  //   label: "My Team",
  //   icon: () => <UserGroupIcon className="h-5 w-5" />,
  // },
];

export default Tabs;
