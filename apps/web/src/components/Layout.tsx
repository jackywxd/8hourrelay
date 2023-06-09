import { PropsWithChildren } from "react";
import Head from "next/head";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import { PageMeta } from "../types";

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function MyLayout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: "8 Hour Relay Race",
    description: "Brought to you by Vercel, Stripe, and Supabase.",
    cardImage: "/og.png",
    ...pageMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <div className="flex flex-col min-h-screen items-center">
        <div className="w-full">
          <Navbar />
        </div>
        <div className="flex flex-col w-full flex-1 justify-center items-center">
          <div className="flex p-2 flex-1 w-full bg-opacity-10 flex-grow justify-center">
            <main
              id="skip"
              className="flex flex-col w-full flex-1 justify-center items-center"
            >
              {children}
            </main>
          </div>
          <div className="flex flex-col self-end w-full items-center">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
