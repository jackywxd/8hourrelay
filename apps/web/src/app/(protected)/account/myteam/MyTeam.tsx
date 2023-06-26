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
import TeamForm from "./TeamForm";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { RaceEntryCreateButton } from "@/components/race-create-button";
import { TeamCreateButton } from "@/components/team-create-button";

const TABLE_HEAD = ["Name", "Email", ""];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// data passed from server side is plain object
function MyTeam() {
  const { store } = useAuth();
  const team = store.userStore.myTeam;
  return (
    <>
      {team ? (
        <TeamForm />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>
            You don't have team yet
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Create your team and invite your friends to join
          </EmptyPlaceholder.Description>
          <TeamCreateButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  );
}

export default observer(MyTeam);
