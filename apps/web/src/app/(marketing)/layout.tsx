import { Metadata } from "next";

import React from "react";

import Layout from "@/components/Layout";
import "@/styles/main.css";
import "@/styles/chrome-bug.css";
// import "focus-visible";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "8 Hour Relay",
  description: "Vancouver 8 hour relay offical website",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div>
        <div>
          <Layout>{children}</Layout>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
