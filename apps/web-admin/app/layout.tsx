import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("root layout");
  return (
    <html lang="en" className="h-full ">
      <head />
      <body className="h-full">
        <ThemeProvider attribute="class" >
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "8 Hour Relay: Admin",
  // viewport: "width=device-width, initial-scale=1",
  description: "Admin Console for 8 Hour Relay",
  icons: "/favicon.ico",
};
