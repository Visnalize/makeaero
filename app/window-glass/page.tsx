import { Metadata } from "next";
import { SITE_URL, ogTitle, defaultOpenGraph, defaultTwitter, webAppJsonLd } from "@/lib/seo";
import WindowGlassClient from "./window-glass-client";

const WINDOW_GLASS_JSONLD = webAppJsonLd({
  name: "Windows 7 Aero Glass Window Generator",
  description:
    "Generate authentic Windows 7 Aero glass window CSS with customizable title bars, glass opacity, border radius, and chrome effects.",
  url: `${SITE_URL}/window-glass`,
});

export const metadata: Metadata = {
  title: "Windows 7 Aero Glass Window Generator",
  description:
    "Generate authentic Windows 7 Aero glass window CSS with customizable title bars, glass opacity, border radius, and chrome effects. Free Frutiger Aero window CSS generator with live preview.",
  keywords: [
    "Windows 7 aero glass window CSS",
    "aero glass window generator",
    "Frutiger Aero window CSS",
    "glass window effect CSS",
    "Windows 7 window style",
    "aero chrome CSS",
    "glass title bar CSS",
    "Windows 7 UI CSS",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: ogTitle("Aero Glass Window Generator"),
    description:
      "Generate authentic Aero glass window CSS with customizable title bars, glass opacity, and chrome effects.",
    url: `${SITE_URL}/window-glass`,
  },
  twitter: {
    ...defaultTwitter,
    title: ogTitle("Aero Glass Window Generator"),
    description:
      "Generate authentic Aero glass window CSS with customizable title bars, glass opacity, and chrome effects.",
  },
  alternates: {
    canonical: `${SITE_URL}/window-glass`,
  },
};

export default function WindowGlassGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WINDOW_GLASS_JSONLD) }}
      />
      <WindowGlassClient />
    </>
  );
}
