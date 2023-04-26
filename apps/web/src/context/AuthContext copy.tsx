import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { applySnapshot } from "mobx-state-tree";

import { app } from "@/firebase/config";
import {
  IRootStore,
  RootStore,
  appStatePersistenceKey,
} from "@8hourrelay/store";
import { UserStore } from "@8hourrelay/store/src/UserStore";

const auth = getAuth(app);

export const AuthContext = React.createContext<IRootStore>(null);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(``);
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState(() => {
    console.log(`current user`, auth.currentUser);
    return auth.currentUser;
  });
  const rootStore = useRef(
    RootStore.create({
      userStore: UserStore.create(user),
    })
  );

  React.useEffect(() => {
    const loadPersistedState = async () => {
      const retrievedState = await AsyncStorage.getItem(appStatePersistenceKey);

      if (retrievedState) {
        const rootStoreJson = JSON.parse(retrievedState);
        if (RootStore.is(rootStoreJson)) {
          applySnapshot(rootStore, rootStoreJson);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    loadPersistedState();

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ rootStore }}>
      {children}
    </AuthContext.Provider>
  );
};
