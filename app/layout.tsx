import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Frutiger Aero Style Generator`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Your go-to tool for creating authentic Frutiger Aero styles with ease, fully customizable and filled with nostalgia.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
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
