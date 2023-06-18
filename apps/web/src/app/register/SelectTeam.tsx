"use client";
import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { useField } from "formik";
import { registerStore } from "@8hourrelay/store";
import { observer } from "mobx-react-lite";
import SelectComponent from "@/components/SelecComponent";

// props.team is the selected team
function SelectTeam(props) {
  const teams = registerStore.teams;

  useEffect(() => {
    if (!registerStore.allTeams) {
      registerStore.onListTeams();
    }
  }, [registerStore.allTeams]);

  if (!props.team && !teams) return null;

  const teamOptions = teams.map((t) => ({
    value: t.name,
    label: t.displayName,
  }));
  console.log(`teamOptions`, teamOptions);
  return (
    <div className="w-72 pt-2">
      <SelectComponent
        {...props}
        options={teamOptions}
        defaultValue={props.team ? props.team : undefined}
        disabled={props.team ? true : false}
      />
    </div>
  );
}
export default observer(SelectTeam);
