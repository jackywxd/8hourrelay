"use client";
import React from "react";
import Tabs from "./Tabs";
import { profileStore } from "./ProfileStore";
import { observer } from "mobx-react-lite";

function TabMenu({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 w-full items-center">
      <div className="flex w-full">
        {Tabs.map((tab, index) => (
          <a
            key={tab.label}
            className={`tab tab-bordered basis-1/2 ${
              index === profileStore.active ? "tab-active" : undefined
            }`}
            onClick={() => profileStore.setActive(index)}
          >
            {tab.icon()}
            <span className="p-1 btm-nav-label">{tab.label}</span>
          </a>
        ))}
      </div>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
}

export default observer(TabMenu);
