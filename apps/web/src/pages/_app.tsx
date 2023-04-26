import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useMemo } from "react";
import Router from "next/router";

import Layout from "@/components/Layout";

import "../styles/main.css";
import "../styles/chrome-bug.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);
  return (
    <div className="bg-black">
      <AuthProvider>
        <SafeAreaProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SafeAreaProvider>
      </AuthProvider>
    </div>
  );
}
