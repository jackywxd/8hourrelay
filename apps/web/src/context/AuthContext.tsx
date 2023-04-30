import React, { createContext, useEffect, ReactNode, useContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

import { RootStore, IRootStore } from "@8hourrelay/store";

import { app } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { IUser } from "@8hourrelay/models";

const auth = getAuth(app);
const db = getFirestore(app);

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
    rootStore.setFirebase(app);
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
    let userListner: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!store) {
        return;
      }
      if (user) {
        console.log(`Getting user data`);
        store.authStore.setUser(user);
        // store.userStore.getUser(user.uid);
        userListner = onSnapshot(doc(db, "Users", user.uid), (doc) => {
          const user = doc.data() as IUser;
          console.log(`New User data`, user);
          store.userStore.setUser(user);
        });
        router.push("/profile");
      } else {
        store.authStore.setUser(null);
      }
    });

    return () => {
      unsubscribe();
      userListner && userListner();
      userListner = null;
    };
  }, []);

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
