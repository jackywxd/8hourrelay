"use client";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useMemo } from "react";
import {
  DefaultTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import Layout from "@/components/Layout";
import "../styles/main.css";
import "../styles/chrome-bug.css";

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    text: "#000000",
    primary: "#FFC700",
    secondary: "#BB4D00",
    // error: "#f13a59",
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <SafeAreaProvider>
              <Layout>{children}</Layout>
            </SafeAreaProvider>
          </AuthProvider>
        </PaperProvider>
      </body>
    </html>
  );
}
