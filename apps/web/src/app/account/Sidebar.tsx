"use client";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  TrophyIcon,
  UserGroupIcon,
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@material-tailwind/react";
import Tabs from "./Tabs";
import { profileStore } from "./ProfileStore";

function Sidebar({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full p-4 !bg-inherit !shadow-md !text-primary basis-1/4 self-start">
        <div className="mb-2 p-4">
          <Typography variant="h5">Profile</Typography>
        </div>
        <List>
          {Tabs.map((tab, index) => (
            <ListItem
              key={tab.label}
              className="!text-white"
              onClick={() => profileStore.setActive(index)}
              selected={index === profileStore.active}
            >
              <ListItemPrefix>{tab.icon()}</ListItemPrefix>
              {tab.label}
            </ListItem>
          ))}
        </List>
      </Card>
      <div className="basis-3/4">{children}</div>
    </div>
  );
}

export default observer(Sidebar);
