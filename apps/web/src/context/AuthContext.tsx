import React, {
  createContext,
  useEffect,
  ReactNode,
  useContext,
  useState,
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-community/async-storage";

import { RootStore, appStatePersistenceKey } from "@8hourrelay/store";
import { app } from "@/firebase/config";
import {
  SnapshotOutOf,
  applySnapshot,
  connectReduxDevTools,
  registerRootStore,
} from "mobx-keystone";

const auth = getAuth(app);

interface AuthContextType {
  store: RootStore;
}

const AuthContext = createContext<AuthContextType>({
  store: new RootStore({}),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [store] = useState<RootStore>(() => {
    const rootStore = new RootStore({});
    // register our root store
    if (auth.currentUser) {
      console.log(`init authStore with currentUser`, {
        currentUser: auth.currentUser,
      });
      rootStore.userStore.setUid(auth.currentUser.uid);
    }
    rootStore.authStore.setAuth(auth);

    registerRootStore(rootStore);
    // we can also connect the store to the redux dev tools
    if (process.env.NODE_ENV === "development") {
      const remotedev = require("remotedev");
      const connection = remotedev.connectViaExtension({
        name: "8HourRelay",
      });

      connectReduxDevTools(remotedev, connection, rootStore);
    }
    return rootStore;
  });

  useEffect(() => {
    const _loadPersistedState = async () => {
      const retrievedState = await AsyncStorage.getItem(appStatePersistenceKey);
      if (retrievedState) {
        const rootStoreJson: SnapshotOutOf<RootStore> =
          JSON.parse(retrievedState);
        console.log(`Parsed root store json`, { rootStoreJson });
        if (rootStoreJson.$modelType === store.$modelType) {
          console.log(`applying rootstore snapshot!!`);
          applySnapshot(store, rootStoreJson);
        }
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!store) {
        return;
      }
      store.authStore.setAuth(auth);
      if (user && user.uid) {
        store.userStore.setUid(user.uid);
      }
    });

    _loadPersistedState();

    // clean up
    return () => {
      unsubscribe();
      store.dispose();
    };
  }, [auth, store]);

  return (
    <AuthContext.Provider value={{ store }}>
      {/* <div className="relative">
        {queue.map((snack, index) => (
          <Snackbar
            key={snack.key}
            text={snack.text}
            variant={snack.variant}
            icon={snack.icon}
            handleClose={() =>
              dispatch({ type: "REMOVE_SNACKBAR", payload: { key: snack.key } })
            }
          />
        ))}
      </div> */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
};
