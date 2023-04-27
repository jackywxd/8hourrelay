import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useMemo } from "react";
import Router from "next/router";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000000",
    primary: "#560CCE",
    secondary: "#414757",
    error: "#f13a59",
  },
};

import Layout from "@/components/Layout";

import "../styles/main.css";
import "../styles/chrome-bug.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SafeAreaProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SafeAreaProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
