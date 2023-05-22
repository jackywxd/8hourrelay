import {
  Auth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";
import {
  runInAction,
  makeObservable,
  reaction,
  action,
  observable,
  flow,
  IReactionDisposer,
  computed,
} from "mobx";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore } from "./RootStore";
import { BaseStore } from "./UIBaseStore";

export type RegisterState =
  | "INIT"
  | "CONFIRM" // confirm email address before sending login link
  | "EMAIL_LINK_SENT"
  | "RECEIVE_LINK"
  | "MISSING_EMAIL"
  | "VERIFY_EMAIL_SEND"
  | "VERFIED"
  | "LOGINED";

export class AuthStore extends BaseStore {
  root: RootStore;
  isAuthenticated: boolean = false;
  emailLocalKey = `8hourrelayEmailKey`;
  email?: string;
  state: RegisterState = "INIT";
  disposer: IReactionDisposer | null = null;
  // Firebase Auth object
  auth: Auth | null = null;

  constructor(root: RootStore) {
    super();
    this.root = root;
    this.state = "INIT";
    this.onInit();
    makeObservable(this, {
      root: false,
      isAuthenticated: observable,
      email: observable,
      state: observable,
      setEmail: action,
      setState: action,
      signinWithEmailLink: flow,
      sendLoginEmailLink: flow,
      currentUser: computed,
    });
  }

  setAuthenticated = (status: boolean) => {
    this.isAuthenticated = status;
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
    super.reset();
    this.setState("INIT");
    this.setAuthenticated(false);
    this.email = undefined;
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
    path?: string // continue link path
  ) {
    if (!this.auth || !this.email) {
      throw new Error(`No auth being set or no email being set!`);
    }
    console.log(`loging with email now`);
    this.isLoading = true;
    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_HOST_NAME}/login?continue=${
          path ?? `account`
        }`,
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
        AsyncStorage.setItem(this.emailLocalKey, this.email!),
        sendSignInLinkToEmail(this.auth, this.email!, actionCodeSettings),
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
      // before logout, reset all states from root
      this.root.dispose();
      yield this.auth.signOut();
    } catch (error) {
      this.error = (error as Error).message;
      console.log(`Failed to signinWithEmail`, { error });
    }
    this.isLoading = false;
  }
}
