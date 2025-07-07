import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make Aero - Frutiger Aero Style Generator",
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
      <body>{children}</body>
    </html>
  );
}
