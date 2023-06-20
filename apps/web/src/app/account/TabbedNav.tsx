"use client";
import React from "react";
import Tabs from "./Tabs";
import { profileStore } from "./ProfileStore";
import { observer } from "mobx-react-lite";

function TabMenu({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="content-container large padding-large">
			<div className="tab-container">
				{Tabs.map((tab, index) => (
					<a
						key={tab.label}
						className={`tab ${
							index === profileStore.active ? "active" : undefined
						}`}
						onClick={() => profileStore.setActive(index)}>
						<span>{tab.label}</span>
					</a>
				))}
			</div>
			<div>{children}</div>
		</div>
	);
}

export default observer(TabMenu);
