"use client";
import { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { useField } from "formik";
import { registerStore } from "@8hourrelay/store";
import { observer } from "mobx-react-lite";

// props.team is the selected team
function SelectComponent(props) {
  const teams = registerStore.teams;
  const [field, meta, helpers] = useField(props);

  useEffect(() => {
    if (!registerStore.allTeams) {
      registerStore.onListTeams();
    }
  }, [registerStore.allTeams]);

  if (!props.team && !teams) return null;

  return (
    <div className="w-72 pt-2">
      <Select
        {...field}
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        disabled={props.team ? true : false}
        // defaultValue={props.team ? props.team : undefined}
        selected={() => (props.team ? props.team : field.value)}
        onChange={helpers.setValue}
        label="Select Team"
        error={meta.touched && meta.error ? true : false}
      >
        {teams?.map((team) => {
          return (
            <Option key={team.id} value={team.displayName}>
              {team.displayName}
            </Option>
          );
        })}
      </Select>
      {meta.touched && meta.error ? (
        <p className="mt-2 text-sm text-red-600" id="error">
          {meta.error}
        </p>
      ) : null}
    </div>
  );
}
export default observer(SelectComponent);
