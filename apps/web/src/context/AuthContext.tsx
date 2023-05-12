import React, {
  createContext,
  useEffect,
  ReactNode,
  useContext,
  useState,
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import { RootStore, appStatePersistenceKey } from "@8hourrelay/store";
import { app } from "@/firebase/config";

const auth = getAuth(app);

interface AuthContextType {
  store: RootStore;
}

const AuthContext = createContext<AuthContextType>({
  store: new RootStore(),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [store] = useState<RootStore>(() => {
    const rootStore = new RootStore();
    // register our root store
    if (auth.currentUser && auth.currentUser.uid) {
      console.log(`init authStore with currentUser`, {
        currentUser: auth.currentUser,
      });
      rootStore.authStore.setAuthenticated(true);
      rootStore.userStore.setUid(auth.currentUser.uid);
    } else {
      rootStore.authStore.setAuthenticated(false);
    }
    rootStore.authStore.setAuth(auth);
    return rootStore;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!store) {
        return;
      }
      store.authStore.setAuth(auth);
      if (user && user.uid) {
        store.authStore.setAuthenticated(true);
        store.userStore.setUid(user.uid);
      }
    });

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
