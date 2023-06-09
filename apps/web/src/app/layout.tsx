"use client";
import { AuthProvider } from "@/context/AuthContext";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Layout from "@/components/Layout";
import "../styles/main.css";
import "../styles/chrome-bug.css";
import "focus-visible";
import Loader from "@/components/Loader";

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
    <html className="antialiased h-full dark" data-theme="dark" lang="en">
      <head />
      <body className="text-brown-100 h-full">
        <Suspense fallback={Loader}>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </Suspense>
        <ToastContainer />
      </body>
    </html>
  );
}
