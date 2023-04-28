"use client";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useMemo } from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import Layout from "@/components/Layout";
import "../styles/main.css";
import "../styles/chrome-bug.css";

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
