"use client";
import { AuthProvider } from "@/context/AuthContext";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Layout from "@/components/Layout";
import "../styles/main.css";
import "../styles/chrome-bug.css";
// import "focus-visible";
import Loader from "@/components/Loader";
import Head from "next/head";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const meta = {
    title: "8 Hour Relay Race",
    description: "Vancouver 8 hour relay offical website",
    // cardImage: "/og.png",
  };
  return (
    <html id="root" lang="en">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {/* <meta property="og:image" content={meta.cardImage} /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {/* <meta name="twitter:image" content={meta.cardImage} /> */}
      </Head>
      <Suspense fallback={Loader}>
        <AuthProvider>
          <body className="flex flex-col min-h-screen w-full items-center">
            <div className="w-full">
              <Navbar />
            </div>
            <div className="flex flex-col w-full flex-1">
              <div className="flex flex-col p-2 flex-1 w-full flex-grow">
                <Layout>{children}</Layout>
              </div>
              <div className="flex flex-col self-end w-full">
                <Footer />
              </div>
            </div>
            <ToastContainer />
          </body>
        </AuthProvider>
      </Suspense>
    </html>
  );
}
