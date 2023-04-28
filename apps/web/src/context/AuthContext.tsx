import React, { createContext, useEffect, ReactNode, useContext } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { RootStore, IRootStore } from "@8hourrelay/store";

import { app } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { AuthStore } from "@8hourrelay/store/src/AuthStore";
const auth = getAuth(app);

interface AuthContextType {
  store: IRootStore;
}

const AuthContext = createContext<AuthContextType>({
  store: RootStore.create({}),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [store] = React.useState<IRootStore>(() => {
    const rootStore = RootStore.create();
    if (auth.currentUser) {
      console.log(`init authStore with currentUser`, {
        currentUser: auth.currentUser,
      });
      rootStore.authStore.setUser(auth.currentUser);
    }
    rootStore.authStore.setAuth(auth);
    return rootStore;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!store) {
        return;
      }
      if (user) {
        store.authStore.setUser(user);
        router.push("/profile");
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
  return context;
};
