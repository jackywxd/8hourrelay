import React, { createContext, useEffect, ReactNode, useContext } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { RootStore, IRootStore } from "@8hourrelay/store";

import { app } from "@/firebase/config";
const auth = getAuth(app);

interface AuthContextType {
  store: IRootStore | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [store] = React.useState<IRootStore | null>(() => {
    const rootStore = RootStore.create({});
    if (auth.currentUser) {
      rootStore.authStore.setUser(auth.currentUser);
    }
    rootStore.authStore.setAuth(auth);
    return rootStore;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        store.authStore.setUser(user);
      } else {
        store.authStore.setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ store }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
