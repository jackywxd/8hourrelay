import { types, flow } from "mobx-state-tree";
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

export const AuthStore = types
  .model({
    isAuthenticated: types.boolean,
    isLoading: types.boolean,
    error: types.maybeNull(types.string),
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

        yield sendEmailVerification(result.user);

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
