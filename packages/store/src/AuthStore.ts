import { types, flow } from "mobx-state-tree";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";

const User = types.model({
  uid: types.string,
  displayName: types.maybeNull(types.string),
  email: types.string,
});

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
        const { uid, displayName, email: userEmail } = result.user;
        self.user = { uid, displayName, email: userEmail };
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
    setUser: (user: User | null) => {
      console.log(`setting user to`, user);
      if (user) {
        const { uid, displayName, email } = user;
        self.user = { uid, displayName, email };
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
