import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://makeaero.com"),
  title: {
    default: "Make Aero - Frutiger Aero Style Generator",
    template: "%s | Make Aero",
  },
  description:
    "Your go-to tool for creating authentic Frutiger Aero styles with ease, fully customizable and filled with nostalgia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
      <GoogleAnalytics gaId="G-3JEWDHLT7J" />
    </html>
  );
}
