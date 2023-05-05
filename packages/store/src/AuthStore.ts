import {
  Auth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { computed } from "mobx";
import {
  Model,
  model,
  tProp,
  types,
  prop,
  modelFlow,
  _async,
  onSnapshot,
  getRoot,
} from "mobx-keystone";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore } from "./RootStore";

export type RegisterState =
  | "INIT"
  | "EMAIL_LINK_SENT"
  | "VERIFY_EMAIL_SEND"
  | "VERFIED";

@model("8HourRelay/AuthStore")
export class AuthStore extends Model({
  email: prop<string | null>(() => null).withSetter(),
  state: prop<RegisterState>(() => "INIT").withSetter(),
  isLoading: tProp(types.boolean, () => false).withSetter(),
  error: tProp(types.maybe(types.string), () => "").withSetter(),
}) {
  // Firebase Auth object
  auth: Auth | null = null;
  @computed
  get emailLocalKey() {
    return `${this.$modelType}-email`;
  }
  @computed
  get currentUser() {
    return this.auth?.currentUser;
  }
  // try to get email from local storage
  onAttachedToRootStore() {
    console.log(`init authStore`);
    if (typeof window === "object")
      AsyncStorage.getItem(this.emailLocalKey).then((data) => {
        console.log(`${this.emailLocalKey} email is ${data}`);
        if (data) {
          this.setEmail(data);
        }
      });

    const disposer = onSnapshot(this, (newSnapshot, prev) => {
      console.log(`new authstore snapshot`, { newSnapshot, prev });
      // save new email
      if (newSnapshot.email && newSnapshot.email !== prev.email) {
        AsyncStorage.setItem(this.emailLocalKey, newSnapshot.email);
      }
    });
    return () => {
      disposer();
    };
  }

  setAuth(auth: Auth) {
    this.auth = auth;
  }

  @modelFlow
  sendLoginEmailLink = _async(function* (
    this: AuthStore,
    email: string,
    path?: string // continue link path
  ) {
    if (!this.auth) {
      throw new Error(`No auth being set`);
    }
    console.log(`loging with email now`);
    this.email = email;
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
      yield sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
      this.state = "EMAIL_LINK_SENT";
    } catch (error) {
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  });
  @modelFlow
  signinWithEmailLink = _async(function* (this: AuthStore, url: string) {
    console.log(`signining with url`, { url });
    if (!this.auth || !this.email) {
      throw new Error(`No user email or no Auth!`);
    }
    if (this.state === "VERFIED") {
      console.log(`already verified with this url`, { url });
      return;
    }
    this.isLoading = true;
    try {
      yield signInWithEmailLink(this.auth, this.email, url);
      if (typeof window === "object")
        yield AsyncStorage.removeItem(this.emailLocalKey);
      this.state = "VERFIED";
    } catch (error) {
      console.log(`Failed to signinWithEmail`, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  });
  @modelFlow
  logout = _async(function* (this: AuthStore) {
    console.log(`signing out`);
    if (!this.auth) {
      throw new Error(`No Auth!`);
    }
    this.isLoading = true;
    try {
      // we should dispose all the listner prior logging out
      const root: RootStore = getRoot(this);
      root.dispose();
      yield this.auth.signOut();
      this.state = "INIT";
    } catch (error) {
      this.error = (error as Error).message;
      console.log(`Failed to signinWithEmail`, { error });
    }
    this.isLoading = false;
  });
}

// export type IRegisterState = Instance<typeof RegisterState>;

// const RegisterState = types.union(
//   types.literal("INIT"),
//   types.literal("EMAIL_LINK_SENT"),
//   types.literal("VERIFY_EMAIL_SEND"),
//   types.literal("RECEIVED_CODE"),
//   types.literal("CODE_VERIFIED"),
//   types.literal("FORGOT_EMAIL_SEND")
// );

// export const AuthStore = types
//   .model({
//     isAuthenticated: types.boolean,
//     isLoading: types.boolean,
//     error: types.maybeNull(types.string),
//     state: RegisterState,
//   })
//   .volatile(() => ({
//     user: {} as User | null,
//     auth: {} as Auth,
//   }))
//   .actions((self) => ({
//     setAuth(auth: Auth) {
//       self.auth = auth;
//     },
//     setUser: (user: User | null) => {
//       console.log(`setting user to`, user);
//       if (user) {
//         self.user = user;
//         self.isAuthenticated = true;
//       } else {
//         self.user = null;
//         self.isAuthenticated = false;
//       }
//     },
//     login: flow(function* (email: string, password: string) {
//       self.isLoading = true;
//       try {
//         console.log(`loging with user ${email}`);
//         const result = yield signInWithEmailAndPassword(
//           self.auth,
//           email,
//           password
//         );
//         console.log(`singIn result`, { result });
//         self.isAuthenticated = true;
//         self.isLoading = false;
//         return { result };
//       } catch (error) {
//         console.log(`failed to login`, error);
//         self.error = error.message;
//         self.isAuthenticated = false;
//         self.isLoading = false;
//         return { error };
//       }
//     }),
//     signup: flow(function* (email: string, password: string) {
//       self.isLoading = true;
//       try {
//         const result = yield createUserWithEmailAndPassword(
//           self.auth,
//           email,
//           password
//         );
//         console.log(`singup result`, { result });

//         if (!self.auth.currentUser) {
//           throw new Error(`No user created!`);
//         }
//         const actionCodeSettings = {
//           url: `https://autotext.mobi?email=${email}`,
//           iOS: {
//             bundleId: "com.8hourrelay",
//           },
//           android: {
//             packageName: "com.8hourrelay",
//             installApp: true,
//           },
//           handleCodeInApp: false,
//         };
//         console.log(`actionCodeSettings`, actionCodeSettings);
//         yield sendEmailVerification(result.user, actionCodeSettings);
//         self.state = "VERIFY_EMAIL_SEND";
//         self.user = result.user;
//         self.isAuthenticated = true;
//         self.isLoading = false;
//         return { result };
//       } catch (error) {
//         self.error = error.message;
//         self.isAuthenticated = false;
//         self.isLoading = false;
//         return { error };
//       }
//     }),
//     verifyEmail: flow(function* (code: string) {
//       self.isLoading = true;
//       try {
//         yield applyActionCode(self.auth, code);
//         self.state = "CODE_VERIFIED";
//       } catch (error) {
//         self.error = error;
//       }
//       self.isLoading = false;
//     }),
//     sendEmailLink: flow(function* (email: string) {
//       self.isLoading = true;
//       try {
//         const actionCodeSettings = {
//           url: __DEV___
//             ? `http://localhost:3000/signinemail`
//             : `https://autotext.mobi?email=${email}`,
//           iOS: {
//             bundleId: "com.8hourrelay",
//           },
//           android: {
//             packageName: "com.8hourrelay",
//             installApp: true,
//           },
//           handleCodeInApp: true,
//         };
//         yield sendSignInLinkToEmail(self.auth, email, actionCodeSettings);
//         const root = getRoot(self);
//         root.save();
//         self.state = "EMAIL_LINK_SENT";
//       } catch (error) {
//         self.error = error;
//       }
//       self.isLoading = false;
//     }),
//     singinWithEmailLink: flow(function* (url: string) {
//       self.isLoading = true;
//       try {
//         yield signInWithEmailLink(self.auth, self.email, url);
//         self.state = "EMAIL_LINK_SENT";
//       } catch (error) {
//         self.error = error;
//       }
//       self.isLoading = false;
//     }),
//     resendCode: flow(function* () {
//       if (!self.user) {
//         throw new Error(`No current login user`);
//       }
//       self.isLoading = true;
//       try {
//         yield sendEmailVerification(self.user);
//         self.state = "CODE_VERIFIED";
//       } catch (error) {
//         self.error = error;
//       }
//       self.isLoading = false;
//     }),
//     forgotPassword: flow(function* (code: string) {
//       self.isLoading = true;
//       if (!self.user || !self.user.email) {
//         throw new Error(`Now user logged in`);
//       }
//       try {
//         yield sendPasswordResetEmail(self.auth, self.user.email);
//         self.state = "FORGOT_EMAIL_SEND";
//       } catch (error) {
//         self.error = error;
//       }
//       self.isLoading = false;
//     }),
//     logout: flow(function* () {
//       self.isLoading = true;
//       try {
//         console.log(`logging current user`, self.user);
//         yield self.auth.signOut();
//         self.user = null;
//         self.state = "INIT";
//         self.isAuthenticated = false;
//         self.isLoading = false;
//       } catch (error) {
//         self.error = error.message;
//         self.isLoading = false;
//       }
//     }),
//     setError: (error: string | null) => {
//       self.error = error;
//     },
//   }));
