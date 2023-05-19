"use client";
import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { RaceEntry } from "@8hourrelay/models";

const data = {
  firstName: "First Name",
  lastName: "Last Name",
  preferName: "Prefer Name",
  phone: "Phone",
  gender: "Gender",
  personalBest: "Personal Best",
  email: "Email",
  yearBirth: "Year of Birth",
  size: "Selected Shirt Size",
  emergencyName: "Emergency Contact Name",
  emergencyPhone: "Emergency Contact Phone",
};

function ConfirmForm({
  raceEntry,
  onSubmit,
  onCancel,
}: {
  raceEntry: RaceEntry;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="w-full max-w-lg">
      <p>
        Please review your registration information carefully and confirm. Race
        entry cannot be change after submitted
      </p>
      <div>Registered Race: {raceEntry.race}</div>
      <div>Entry Fee: {raceEntry.entryFee}</div>
      <div className="divider">Race Entry Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6">
        {Object.entries(raceEntry).map((entry) => {
          if (entry[1] && data[entry[0]])
            return (
              <div key={entry[0]} className="flex w-full justify-between">
                <div className="">{data[entry[0]]} :</div>
                <div>{entry[1]}</div>
              </div>
            );
        })}
        <div className="form-control mt-3">
          <label className="label cursor-pointer gap-3">
            <span className="label-text">CONFIRM</span>
            <input
              type="checkbox"
              checked={confirm}
              className="checkbox checkbox-md checkbox-primary"
              onChange={() => {
                setConfirm(!confirm);
              }}
            />
          </label>
        </div>
        <div className="flex gap-10 justify-between w-full mt-10">
          <Button
            disabled={!confirm}
            fullWidth
            type="submit"
            onClick={onSubmit}
            className="!btn-primary"
          >
            {raceEntry.isPaid ? `Update` : `Payment`}
          </Button>
          <Button
            fullWidth
            type="submit"
            onClick={onCancel}
            className="!btn-secondary"
          >
            EDIT
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmForm;
