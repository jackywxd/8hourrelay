import {
  Auth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";
import {
  runInAction,
  makeAutoObservable,
  reaction,
  action,
  flow,
  IReactionDisposer,
  computed,
} from "mobx";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore } from "./RootStore";

export type RegisterState =
  | "INIT"
  | "EMAIL_LINK_SENT"
  | "RECEIVE_LINK"
  | "MISSING_EMAIL"
  | "VERIFY_EMAIL_SEND"
  | "VERFIED"
  | "LOGINED";

export class AuthStore {
  root: RootStore;
  emailLocalKey = `8hourrelayEmailKey`;
  email?: string;
  state: RegisterState = "INIT";
  isLoading = false;
  error = "";
  disposer: IReactionDisposer | null = null;
  // Firebase Auth object
  auth: Auth | null = null;

  constructor(root: RootStore) {
    this.root = root;
    this.state = "INIT";
    this.onInit();
    makeAutoObservable(
      this,
      {
        setEmail: action,
        setState: action,
        signinWithEmailLink: flow,
        sendLoginEmailLink: flow,
        currentUser: computed,
      },
      { autoBind: true }
    );
  }

  setError = (error: string) => {
    this.error = error;
  };

  setEmail = (email: string) => {
    this.email = email;
  };

  get currentUser() {
    console.log(`getting current user ${this.auth?.currentUser?.email}`);
    return this.auth?.currentUser;
  }

  // try to get email from local storage
  onInit() {
    console.log(`init authStore`);
    this.disposer = reaction(
      () => this.email,
      (newEmail, prev) => {
        console.log(`new authstore snapshot`, { newEmail, prev });
        // save new email
        if (newEmail) {
          AsyncStorage.setItem(this.emailLocalKey, newEmail);
        }
      }
    );
    if (typeof window === "object")
      AsyncStorage.getItem(this.emailLocalKey).then((data) => {
        console.log(`${this.emailLocalKey} email is ${data}`);
        if (data) {
          runInAction(() => {
            this.email = data;
          });
        }
      });
  }

  dispose() {
    if (this.disposer) {
      this.disposer();
      this.disposer = null;
    }
  }

  setState = (state: RegisterState) => {
    console.log(`settting auth state to ${state}`);
    this.state = state;
  };

  setAuth = (auth: Auth) => {
    this.auth = auth;
  };

  *sendLoginEmailLink(
    email: string,
    path?: string // continue link path
  ) {
    if (!this.auth) {
      throw new Error(`No auth being set`);
    }
    console.log(`loging with email now`);
    this.setEmail(email);
    this.isLoading = true;
    try {
      console.log(`env`, process.env);
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_HOST_NAME}/${path ?? `register`}`,
        iOS: {
          bundleId: "com.8hourrelay",
        },
        android: {
          packageName: "com.8hourrelay",
          installApp: true,
        },
        handleCodeInApp: true,
      };
      yield Promise.all([
        AsyncStorage.setItem(this.emailLocalKey, email),
        sendSignInLinkToEmail(this.auth, email, actionCodeSettings),
      ]);
      this.state = "EMAIL_LINK_SENT";
    } catch (error) {
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  }

  *signinWithEmailLink(url: string, email?: string) {
    console.log(`signining with url`, { url, email });
    if (!this.auth) {
      throw new Error(`No Auth yet!`);
    }
    if (this.isLoading) {
      return;
    }
    const loginEmail = email ?? this.email;
    if (isSignInWithEmailLink(this.auth, url)) {
      // no email has been set yet
      if (!loginEmail) {
        this.setState("MISSING_EMAIL");
        return;
      }

      if (this.state === "VERFIED") {
        console.log(`already verified with this url`, { url });
        return;
      }
      this.isLoading = true;
      try {
        yield signInWithEmailLink(this.auth, loginEmail, url);
        if (typeof window === "object")
          yield AsyncStorage.removeItem(this.emailLocalKey);
        this.state = "VERFIED";
      } catch (error) {
        console.log(`Failed to signinWithEmail`, { error });
        this.error = (error as Error).message;
      }
      this.isLoading = false;
    }
  }

  *logout() {
    console.log(`signing out`);
    if (!this.auth) {
      throw new Error(`No Auth!`);
    }
    this.isLoading = true;
    try {
      this.root.dispose();
      yield this.auth.signOut();
      this.state = "INIT";
    } catch (error) {
      this.error = (error as Error).message;
      console.log(`Failed to signinWithEmail`, { error });
    }
    this.isLoading = false;
  }
}
