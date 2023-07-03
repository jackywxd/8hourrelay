import { makeObservable, observable, action, computed, flow } from "mobx";
import { BaseStore } from "./UIBaseStore";
import { UserStore } from "./UserStore";
import { event2023, RaceEntry, Team } from "@8hourrelay/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDoc, doc, deleteDoc, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

export function validatePhoneNumber(phoneNumber: string) {
  // The regex matches U.S. phone number format
  const re = /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
  const e164 = /^\+?[1-9]\d{1,14}$/;

  if (re.test(phoneNumber) || e164.test(phoneNumber)) {
    return true;
  }

  return false;
}

import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";

import { entryFormSnapshot } from "./RootStore";
import { getApp } from "firebase/app";

export type RegistrationState =
  | "INIT"
  | "RE_EDIT" // editing form
  | "EDIT" // editing form
  | "CONFIRM" // confirm form
  | "FORM_SUBMITTED" //form submitted
  | "ERROR"
  | "SUCCESS";

// entries user can update after register payment
export const editableEntries = [
  "firstName",
  "lastName",
  "preferName",
  "personalBest",
  "email", // for other people's entry
  "phone",
  "gender",
  "size",
  "team",
  "emergencyName",
  "emergencyPhone",
];

export class RegistrationStore extends BaseStore {
  editIndex: number | null = null; // current edit raceEntries index
  userStore: UserStore | null = null;
  state: RegistrationState = "INIT";
  form: RaceEntry | null = null;
  allTeams: Team[] | null = null;
  teamFilter: string | null = null;
  teamValidated = false;
  genderOptions = ["Male", "Female"].map((m) => ({ value: m, label: m }));
  shirtSizeOptions = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((m) => ({
    value: m,
    label: m,
  }));
  raceOptions = event2023.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: `$${race.entryFee} CAD`,
  }));

  constructor() {
    super();
    makeObservable(this, {
      editIndex: observable,
      state: observable,
      teamValidated: observable,
      teamFilter: observable,
      form: observable,
      allTeams: observable,
      validateForm: action,
      setForm: action,
      setState: action,
      setEditIndex: action,
      setTeamFilter: action,
      setTeamValidated: action,
      getRaceByTeam: action,
      initRaceEntryForm: action,
      initWithRaceid: action,
      isAgeValid: action,
      teams: computed,
      raceEntry: computed,
      onGetStripeSession: flow,
      deleteRaceEntry: flow,
      updateRaceEntry: flow,
      submitRaceForm: flow,
      validateTeamPassword: flow,
      onListTeams: flow,
    });
  }

  get teams() {
    let teams: Team[] = [];
    if (this.teamFilter && this.allTeams && this.allTeams.length > 0) {
      teams = this.allTeams.filter(
        (f) => f.race.toLowerCase() === this.teamFilter?.toLowerCase()
      );
    }
    if (!this.teamFilter && this.allTeams) {
      teams = this.allTeams;
    }
    console.log(`updating new teams data`, teams);
    return teams;
  }

  getRaceByTeam(team: string) {
    if (this.allTeams && team) {
      const teams = this.allTeams.filter(
        (f) => f.name.toLowerCase() === team.toLowerCase()
      );
      const race = teams[0]?.race;
      console.log(`getRaceByTeam`, race);
      return race;
    }
    return null;
  }

  getTeamDisplayName(team: string) {
    if (this.allTeams) {
      const teams = this.allTeams.filter(
        (f) => f.name.toLowerCase() === team.toLowerCase()
      );
      const race = teams[0]?.displayName;
      console.log(`getRaceByTeam`, race);
      return race;
    }
    return "";
  }

  get existingEntries() {
    if (this.userStore && this.userStore.raceEntries) {
      return this.userStore.raceEntries
        .filter((r) => r)
        .filter((r) => r.isPaid)
        .map((r) => `${r.email}${r.firstName}${r.lastName}`.toLowerCase());
    }
    return [];
  }

  validateForm(form: Partial<RaceEntry>) {
    let errors: any = {};
    console.log(`validatForm`, form, this.userStore?.raceEntries.slice());

    if (form.race && form.birthYear) {
      const re = /^\d{4}$/;

      if (!re.test(form.birthYear)) {
        errors.birthYear = `Year of birth must be 4 digits`;
      } else if (!this.isAgeValid(form.birthYear, form.race))
        errors[`birthYear`] = `Invalid age for the race selected`;
    }
    console.log(`formvalidate errors`, { errors });
    if (form.email && form.firstName && form.lastName) {
      if (
        this.existingEntries.includes(
          `${form.email}${form.firstName}${form.lastName}`.toLowerCase()
        )
      ) {
        errors.email = `Email already registered. `;
        errors.firstName = `Duplicated entry. The name is already registered with the same email.`;
        errors.lastName = `Duplicated entry. The name is already registered with the same email.`;
      }
    }
    if (form.phone && !validatePhoneNumber(form.phone)) {
      errors.phone = `Invalid phone number`;
    }
    if (form.emergencyPhone && !validatePhoneNumber(form.emergencyPhone)) {
      errors.emergencyPhone = `Invalid phone number`;
    }
    return errors;
  }

  isAgeValid(birthYear: string, raceRegistered?: string) {
    let valid = false;
    const race = event2023.races.filter((r) => r.name === raceRegistered);
    if (race && race.length > 0) {
      valid = race[0].isValid(birthYear);
    }
    console.log(`birhty year is valid ${valid}`);
    return valid;
  }

  setTeamFilter(race: string | null) {
    console.log(`setting team filter to ${race}`);
    this.teamFilter = race;
  }

  setTeamValidated(status: boolean) {
    this.teamValidated = status;
  }

  attachedUserStore(userStore: UserStore) {
    this.userStore = userStore;
    this.onListTeams();
  }

  reset(): void {
    super.reset();
    this.form = null;
    this.editIndex = null;
    this.teamFilter = null;
    this.state = "INIT";
  }

  setForm(form: RaceEntry | null) {
    this.form = form ? form : null;
  }

  setEditIndex(index: number | null) {
    this.editIndex = index;
    if (
      index &&
      this.userStore?.raceEntries?.length &&
      this.userStore.raceEntries.length > index
    ) {
      this.teamFilter = this.userStore.raceEntries[index].race;
    }
  }

  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  get raceEntry() {
    if (
      this.editIndex !== null &&
      this.userStore?.raceEntries &&
      this.userStore.raceEntries.length > 0
    ) {
      return this.userStore.raceEntries[this.editIndex];
    }
    return null;
  }

  setState(state: RegistrationState) {
    console.log(`setting state to ${state}`);
    this.state = state;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  initWithRaceid(raceId: string) {
    let race;
    this.userStore?.raceEntries.forEach((r, i) => {
      console.log(`init with race Id ${raceId}`);
      if (r.id === raceId && !r.isPaid) {
        this.setEditIndex(i);
        this.setTeamFilter(r.race!);
        race = r;
        return r;
      }
    });
    if (race) return race;
    return null;
  }
  // team name could be passed
  initRaceEntryForm(team?: Team) {
    if (this.state === "RE_EDIT" && this.form) return this.form;
    if (this.form) return this.form;
    if (team) this.teamFilter = team.race;
    else if (this.teamFilter) this.setTeamFilter(null);

    const raceEntry = this.raceEntry;
    const user = this.userStore?.user;

    const raceInitEntry = {
      id: raceEntry?.id ?? "",
      year: raceEntry?.year ?? new Date().getFullYear().toString(),
      uid: this.userStore?.uid,
      email: raceEntry?.email ?? user?.email ?? "",
      firstName: raceEntry?.firstName ?? user?.firstName ?? "",
      lastName: raceEntry?.lastName ?? user?.lastName ?? "",
      preferName: raceEntry?.preferName ?? user?.preferName ?? "",
      phone: raceEntry?.phone ?? user?.phone ?? "",
      gender: raceEntry?.gender ?? user?.gender ?? "",
      wechatId: raceEntry?.wechatId ?? user?.wechatId ?? "",
      birthYear: raceEntry?.birthYear ?? user?.birthYear ?? "",
      personalBest: raceEntry?.personalBest ?? user?.personalBest ?? "",
      race: team ? team.race : raceEntry?.race ?? "",
      size: raceEntry?.size ?? "",
      emergencyName: raceEntry?.emergencyName ?? "",
      emergencyPhone: raceEntry?.emergencyPhone ?? "",
      isActive: raceEntry?.isActive ?? true,
      isPaid: raceEntry?.isPaid ?? false,
      team: team ? team.name : raceEntry?.team ?? "",
      teamId: team ? team.id : raceEntry?.teamId ?? "",
      teamPassword: "",
      teamState: "",
      accepted: false,
    };
    return raceInitEntry as RaceEntry;
  }

  *updateRaceEntry(form: RaceEntry) {
    console.log(`Updating race entry to new data`, {
      form,
      index: this.editIndex,
    });
    this.isLoading = true;
    try {
      const data: any = {};
      Object.entries(form).forEach((e) => {
        if (e[1] && editableEntries.includes(e[0])) {
          data[e[0]] = e[1];
        }
      });
      console.log(`update race with data`, { data });
      if (this.userStore?.uid && this.raceEntry) {
        const id = this.raceEntry.id;
        yield setDoc(
          doc(this.db, "Users", this.userStore.uid, "RaceEntry", id),
          data,
          {
            merge: true,
          }
        );
        yield AsyncStorage.removeItem(entryFormSnapshot);
        this.setEditIndex(null);
        this.setState("SUCCESS");
      } else {
        throw new Error(`Failed to update race entry! Missing uid and raceId`);
      }
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to Update Race Entry`, error);
      this.error = (error as Error).message;
      this.isLoading = false;
      this.setState("ERROR");
    }
  }

  *deleteRaceEntry() {
    if (this.isLoading) return;
    const idd = toast.loading(`Deleting race entry...`);
    this.isLoading = true;
    try {
      if (!this.raceEntry || !this.editIndex) {
        throw new Error(`No selected delete race entry`);
      }
      const id = this.raceEntry.id;
      const index = this.editIndex;
      // const newEntry = this.raceEntries?.filter(f=>f.id!==id)
      this.setEditIndex(null);
      this.userStore?.spliceRaceEntry(index);
      yield deleteDoc(
        doc(this.db, "Users", this.userStore?.uid!, "RaceEntry", id)
      );
      toast.update(idd, {
        render: `Race entry deleted successfully`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.error = (error as Error).message;
      toast.update(idd, {
        render: `Failed to delete race entry`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
    this.isLoading = false;
  }

  *onGetStripeSession(sessionId: string) {
    if (this.isLoading) return;
    const functions = getFunctions();
    const onGetStripeSession = httpsCallable(functions, "onGetStripeSession");

    this.isLoading = true;
    try {
      const result: HttpsCallableResult<{ id: string }> =
        yield onGetStripeSession({ session_id: sessionId });
      console.log(`session result`, result);

      return result.data;
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
    return null;
  }

  *submitRaceForm(): unknown {
    if (this.isLoading) return;
    const functions = getFunctions();
    const onCreateCheckout = httpsCallable(functions, "onCreateCheckout");
    if (!this.form) {
      this.setError(`Invalid data`);
      return;
    }
    const { team, teamPassword } = this.form;

    if (!team && teamPassword) {
      this.setError(`Invalid data`);
      return;
    }

    const id = toast.loading(`Submiting race entry...`);
    this.isLoading = true;

    try {
      if (!this.teamValidated) {
        const isPasswordValid = yield this.validateTeamPassword(
          team!,
          teamPassword!
        );
        if (!isPasswordValid) {
          this.setError(`Team password is not correct`);
          this.isLoading = false;
          return;
        }
      }
      const result: HttpsCallableResult<unknown> = yield onCreateCheckout(
        this.form
      );
      console.log(`submit result`, result);

      if (result) {
        this.setEditIndex(null);
        toast.update(id, {
          render: `Race entry submitted successfully. Redirecting to payment page...`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        return result.data;
      }
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
    toast.update(id, {
      render: `Failed to submit race entry`,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    this.setState("ERROR");
    return null;
  }

  *validateTeamPassword(team: string, teamPassword: string) {
    const functions = getFunctions();
    const onValidateTeamPassword = httpsCallable(
      functions,
      "onValidateTeamPassword"
    );

    console.log(`sending toast...`);
    const id = toast.loading(`Validating team password...`);
    this.setLoading(true);
    try {
      const result: HttpsCallableResult<{ id: string; error?: string }> =
        yield onValidateTeamPassword({
          team: team.toLowerCase(),
          teamPassword,
        });
      console.log(`validated result`, result.data);

      if (result.data) {
        // return team ID, then set the team ID
        if (result.data.id) {
          if (this.form) this.form.teamId = result.data.id;
          this.setTeamValidated(true);
          toast.update(id, {
            render: `Team password validated`,
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
        } else if (result.data.error) {
          toast.update(id, {
            render: result.data.error,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          this.setLoading(false);
          return false;
        }
        this.setLoading(false);
        return true;
      }
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.setLoading(false);
    toast.update(id, {
      render: `Invalid team password. Please get the correct team password from your team captain.`,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    return false;
  }

  *onListTeams(race?: string) {
    if (this.isLoading) return;
    const functions = getFunctions();
    const onListTeams = httpsCallable(functions, "onListTeams");

    this.isLoading = true;
    try {
      const result: HttpsCallableResult<Team[]> = yield onListTeams({
        race,
      });
      console.log(`list teams result`, result);

      if (result.data) {
        this.allTeams = result.data.map((f) => f && new Team(f));
      }
      this.isLoading = false;
      return result.data;
    } catch (error) {
      console.log(`Failed to list teams`, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
    return null;
  }
}
