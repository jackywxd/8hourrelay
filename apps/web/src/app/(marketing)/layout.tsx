import { Metadata } from "next";

import React from "react";

import Layout from "@/components/Layout";
import "@/styles/landing.css";
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
    <div className="flex flex-col min-h-screen w-full items-center">
      <div className="w-full bg-red-600 z-30">
        <Navbar />
      </div>
      <div className="flex flex-col w-full flex-1">
        <div className="flex flex-col p-2 flex-1 w-full flex-grow">
          <Layout>{children}</Layout>
        </div>
        <div className="flex flex-col self-end w-full">
          <div className="container mx-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
