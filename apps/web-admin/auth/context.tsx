"use client";

import { createContext, useContext } from "react";
import type { UserInfo } from "firebase/auth";
import { Claims } from "next-firebase-auth-edge/lib/auth/claims";
import { AdminStore } from "@/store/adminStore";

export interface User extends Omit<UserInfo, "providerId"> {
  emailVerified: boolean;
  role: string | null;
  customClaims: Claims;
}

export interface AuthContextValue {
  user: User | null;
  store: AdminStore | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  store: null,
});

export const useAuth = () => useContext(AuthContext);
