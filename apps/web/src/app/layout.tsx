"use client";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

import Layout from "@/components/Layout";
import "../styles/main.css";
import "../styles/chrome-bug.css";

// export const theme = {
//   ...MD3DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     text: "#000000",
//     primary: "#FFC700",
//     secondary: "#BB4D00",
//     // error: "#f13a59",
//   },
// };

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="dark" lang="en">
      <head />
      <body className="text-brown-100">
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
