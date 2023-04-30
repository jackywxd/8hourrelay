import { types, flow, Instance } from "mobx-state-tree";
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

export type IRegisterState = Instance<typeof RegisterState>;

const RegisterState = types.union(
  types.literal("INIT"),
  types.literal("VERIFY_EMAIL_SEND"),
  types.literal("RECEIVED_CODE"),
  types.literal("CODE_VERIFIED"),
  types.literal("FORGOT_EMAIL_SEND")
);

export const AuthStore = types
  .model({
    isAuthenticated: types.boolean,
    isLoading: types.boolean,
    error: types.maybeNull(types.string),
    state: RegisterState,
  })
  .volatile(() => ({
    user: {} as User | null,
    auth: {} as Auth,
  }))
  .actions((self) => ({
    setAuth(auth: Auth) {
      self.auth = auth;
    },
    setUser: (user: User | null) => {
      console.log(`setting user to`, user);
      if (user) {
        self.user = user;
        self.isAuthenticated = true;
      } else {
        self.user = null;
        self.isAuthenticated = false;
      }
    },
    login: flow(function* (email: string, password: string) {
      self.isLoading = true;
      try {
        console.log(`loging with user ${email}`);
        const result = yield signInWithEmailAndPassword(
          self.auth,
          email,
          password
        );
        console.log(`singIn result`, { result });
        self.isAuthenticated = true;
        self.isLoading = false;
        return { result };
      } catch (error) {
        console.log(`failed to login`, error);
        self.error = error.message;
        self.isAuthenticated = false;
        self.isLoading = false;
        return { error };
      }
    }),
    signup: flow(function* (email: string, password: string) {
      self.isLoading = true;
      try {
        const result = yield createUserWithEmailAndPassword(
          self.auth,
          email,
          password
        );
        console.log(`singup result`, { result });

        if (!self.auth.currentUser) {
          throw new Error(`No user created!`);
        }
        const actionCodeSettings = {
          url: `https://autotext.mobi?email=${email}`,
          iOS: {
            bundleId: "com.8hourrelay",
          },
          android: {
            packageName: "com.8hourrelay",
            installApp: true,
          },
          handleCodeInApp: false,
        };
        console.log(`actionCodeSettings`, actionCodeSettings);
        yield sendEmailVerification(result.user, actionCodeSettings);
        self.state = "VERIFY_EMAIL_SEND";
        self.user = result.user;
        self.isAuthenticated = true;
        self.isLoading = false;
        return { result };
      } catch (error) {
        self.error = error.message;
        self.isAuthenticated = false;
        self.isLoading = false;
        return { error };
      }
    }),
    verifyEmail: flow(function* (code: string) {
      self.isLoading = true;
      try {
        yield applyActionCode(self.auth, code);
        self.state = "CODE_VERIFIED";
      } catch (error) {
        self.error = error;
      }
      self.isLoading = false;
    }),
    resendCode: flow(function* () {
      if (!self.user) {
        throw new Error(`No current login user`);
      }
      self.isLoading = true;
      try {
        yield sendEmailVerification(self.user);
        self.state = "CODE_VERIFIED";
      } catch (error) {
        self.error = error;
      }
      self.isLoading = false;
    }),
    forgotPassword: flow(function* (code: string) {
      self.isLoading = true;
      if (!self.user || !self.user.email) {
        throw new Error(`Now user logged in`);
      }
      try {
        yield sendPasswordResetEmail(self.auth, self.user.email);
        self.state = "FORGOT_EMAIL_SEND";
      } catch (error) {
        self.error = error;
      }
      self.isLoading = false;
    }),
    logout: flow(function* () {
      self.isLoading = true;
      try {
        console.log(`logging current user`, self.user);
        yield self.auth.signOut();
        self.user = null;
        self.state = "INIT";
        self.isAuthenticated = false;
        self.isLoading = false;
      } catch (error) {
        self.error = error.message;
        self.isLoading = false;
      }
    }),
    setError: (error: string | null) => {
      self.error = error;
    },
  }));
