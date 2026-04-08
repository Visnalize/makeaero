import { Metadata } from "next";
import { SITE_URL, ogTitle, defaultOpenGraph, defaultTwitter } from "@/lib/seo";
import OrbClient from "./orb-client";

export const metadata: Metadata = {
  title: "Glossy Orb Generator",
  description:
    "Create Frutiger Aero-style glossy orbs as CSS code or downloadable PNG images. Embed your own logo inside a Windows 7 glass sphere. Free online orb generator with live preview.",
  keywords: [
    "frutiger aero orb",
    "glossy orb CSS generator",
    "aero sphere CSS",
    "Windows 7 orb generator",
    "glass sphere CSS",
    "orb PNG maker",
    "glossy ball CSS",
    "aero globe generator",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: ogTitle("Glossy Orb Generator"),
    description:
      "Create Frutiger Aero glossy orbs as CSS code or downloadable PNG images with your custom logo inside.",
    url: `${SITE_URL}/orb`,
  },
  twitter: {
    ...defaultTwitter,
    title: ogTitle("Glossy Orb Generator"),
    description:
      "Create Frutiger Aero glossy orbs as CSS code or downloadable PNG images with your custom logo inside.",
  },
  alternates: {
    canonical: `${SITE_URL}/orb`,
  },
};

export default function OrbGeneratorPage() {
  return <OrbClient />;
}

