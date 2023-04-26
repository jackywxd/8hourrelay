import { types, flow } from "mobx-state-tree";
import {
  Auth,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { User, IUser } from "./models/User";

export const AuthStore = types
  .model({
    user: types.maybeNull(User),
    isAuthenticated: types.boolean,
    isLoading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .volatile((self) => ({
    auth: {} as Auth,
  }))
  .actions((self) => ({
    setAuth(auth: Auth) {
      self.auth = auth;
    },
    login: flow(function* (email: string, password: string) {
      self.isLoading = true;
      try {
        const result = yield signInWithEmailAndPassword(
          self.auth,
          email,
          password
        );
        console.log(`singIn result`, { result });
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
    setUser: (user: FirebaseUser | null) => {
      console.log(`setting user to`, user);
      if (user) {
        const { uid, email, emailVerified, displayName } = user;
        self.user = { uid, email, emailVerified, name: displayName } as IUser;
        self.isAuthenticated = true;
      } else {
        self.user = null;
        self.isAuthenticated = false;
      }
    },
    setError: (error: string | null) => {
      self.error = error;
    },
  }));
