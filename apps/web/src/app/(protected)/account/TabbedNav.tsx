"use client";
import React from "react";
import Tabs from "./Tabs";
import { profileStore } from "./ProfileStore";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  navItems: {
    href: string;
    title: string;
  }[];
}

function TabMenu({ className, navItems, ...props }: NavProps) {
  const pathname = usePathname();
  return (
    <div className="content-container large padding-large">
      <div className="tab-container">
        {navItems.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab ${pathname === tab.href ? "active" : undefined}`}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default observer(TabMenu);
