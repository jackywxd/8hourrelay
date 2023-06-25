"use client";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";
import LoginFirst from "@/components/LoginFirst";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FieldItem } from "@/components/CustomFiled";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RaceEntries } from "@/components/raceEntries";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { RaceEntryCreateButton } from "@/components/race-create-button";
import { DashboardShell } from "@/components/shell";
const TABLE_HEAD = ["Name", "Email", ""];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// data passed from server side is plain object
function MyRacePage() {
  const { store } = useAuth();
  const raceEntries = store.userStore?.raceEntries.slice();

  console.log(`raceEntries`, { raceEntries });

  if (!raceEntries || raceEntries.length === 0) {
    return <div>Add your first Race</div>;
  }

  const onSubmit = () => {
    toast.error(`Team password cannot be blank`);
  };
  return (
    <DashboardShell>
      {raceEntries?.length ? (
        <div className="divide-y divide-border rounded-md border p-2">
          <RaceEntries raceEntries={raceEntries} />
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No race entry</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any race entry yet.
          </EmptyPlaceholder.Description>
          <RaceEntryCreateButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  );
}

export default observer(MyRacePage);
