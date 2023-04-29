import { PropsWithChildren } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import { PageMeta } from "../types";

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function MyLayout({ children, meta: pageMeta }: Props) {
  const router = useRouter();
  const meta = {
    title: "Next.js Subscription Starter",
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
      <Navbar />
      <div className="min-h-screen bg-zinc-500 ">
        <main id="skip">{children}</main>
      </div>
      <Footer />
    </>
  );
}
