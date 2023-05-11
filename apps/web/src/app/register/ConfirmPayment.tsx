"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { Spinner, Button } from "@material-tailwind/react";

import { clone, fromSnapshot, getSnapshot, onSnapshot } from "mobx-keystone";
import AsyncStorage from "@react-native-community/async-storage";
import SelectComponent from "@/components/SelecComponent";
import { loadStripe } from "@stripe/stripe-js";
import { entryFormSnapshot } from "@8hourrelay/store/src/RootStore";
import { RaceEntry } from "@8hourrelay/models";
import { useAuth } from "@/context/AuthContext";

function ConfirmForm({
  raceEntry,
  onSubmit,
}: {
  raceEntry: RaceEntry;
  onSubmit: () => void;
}) {
  const { store } = useAuth();
  return (
    <div className="w-full max-w-lg">
      <div>Email: {raceEntry.email}</div>
      <div className="divider">Race Entry Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6">
        Please confirm and Pay {raceEntry.entryFee}
        <div className="mt-10">
          <Button
            variant="gradient"
            fullWidth
            type="submit"
            onClick={onSubmit}
            className="flex items-center gap-3"
          >
            {store.isLoading && <Spinner />} Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default observer(ConfirmForm);
