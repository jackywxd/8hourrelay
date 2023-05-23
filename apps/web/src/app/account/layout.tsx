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
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@material-tailwind/react";
import Sidebar from "./Sidebar";
import TabbedNav from "./TabbedNav";
import { profileStore } from "./ProfileStore";

function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { store } = useAuth();

  const user = store.userStore.user;

  console.log(`profileStore selected`, { selected: profileStore.selectedTab });
  return (
    <div className="flex w-full justify-center">
      <div className="hidden md:block">
        <Sidebar children={children} />
      </div>
      <div className="md:hidden">
        <TabbedNav children={children} />
      </div>
    </div>
  );
}

export default observer(ProfileLayout);
