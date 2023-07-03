import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

const ogUrl = new URL(`${process.env.NEXT_PUBLIC_HOST_NAME}api/og`);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "8hourrelay",
    "Vancouver",
    "8 hour relay",
    "Running race",
    "4 hour youth relay",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: ogUrl.toString(),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [ogUrl.toString()],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${process.env.NEXT_PUBLIC_HOST_NAME}/site.webmanifest`,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <link href="https://fonts.googleapis.com/css2?family=Abel&family=Aboreto&family=Babylonica&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Bebas+Neue&family=Bilbo&family=Bilbo+Swash+Caps&family=Euphoria+Script&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Libre+Bodoni:ital,wght@0,400;0,500;1,400;1,500&family=Noto+Serif+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;1,100;1,200;1,300;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
     </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
          {/* <Toaster /> */}
          <TailwindIndicator />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
