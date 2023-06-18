"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";

const AccountButton = () => {
  const { store } = useAuth();

  return (
    <li className="nav-link signin">
      <a href={store.authStore.isAuthenticated ? `/account` : `/login`}>
        {store.authStore.isAuthenticated ? `Account` : <>SIGN IN</>}
      </a>
    </li>
  );
};

export default observer(AccountButton);
