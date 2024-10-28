import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { InstallHeader } from "@/components/layout/install-header";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "WebShareTarget Fun",
  description: "WebShareTarget Fun",
  manifest: "/manifest.webmanifest",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "48x48",
      url: "/favicons/favicon-48x48.png",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicons/favicon.svg",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicons/apple-touch-icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <InstallHeader />

        {children}
      </body>
    </html>
  );
}
