"use client";
import React, {
  createContext,
  useEffect,
  ReactNode,
  useContext,
  useState,
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { enableStaticRendering } from "mobx-react-lite";

import { RootStore, appStatePersistenceKey } from "@8hourrelay/store";
import { app } from "@/firebase/config";

const auth = getAuth(app);

// MobX configuration for server-side rendering
enableStaticRendering(typeof window === "undefined");

interface AuthContextType {
  store: RootStore;
}

const AuthContext = createContext<AuthContextType>({
  store: new RootStore(),
});

interface AuthProviderProps {
  children: ReactNode;
}
let store: RootStore;

// function to initialize the store
function initializeStore(): RootStore {
  const _store = store ?? new RootStore();

  // For server side rendering always create a new store
  if (typeof window === "undefined") return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const rootStore = initializeStore();

  if (auth.currentUser && auth.currentUser.uid) {
    console.log(`init authStore with currentUser`, {
      currentUser: auth.currentUser.uid,
    });
    rootStore.userStore.setUid(auth.currentUser.uid);
  } else {
    rootStore.userStore.setUid(null);
  }
  rootStore.authStore.setAuth(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`useEffect update user`, { user });
      if (user && user.uid) {
        rootStore.userStore.setUid(user.uid);
      } else {
        rootStore.userStore.setUid(null);
      }
    });

    // clean up
    return () => {
      console.log(`clean up authProvider`);
      unsubscribe();
      rootStore.dispose();
    };
  }, [auth, rootStore]);

  return (
    <AuthContext.Provider value={{ store: rootStore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
};
