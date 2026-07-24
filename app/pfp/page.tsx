import { Metadata } from "next";
import { SITE_URL, ogTitle, defaultOpenGraph, defaultTwitter, webAppJsonLd } from "@/lib/seo";
import PfpClient from "./pfp-client";

const PFP_JSONLD = webAppJsonLd({
  name: "Frutiger Aero PFP Generator",
  description:
    "Free tool for creating glossy Frutiger Aero profile pictures — your photo, initials, or an emoji on a dreamy Aero scene with a shiny sheen and iridescent bubble rim. Download a transparent PNG.",
  url: `${SITE_URL}/pfp`,
});

export const metadata: Metadata = {
  title: "Frutiger Aero PFP Generator",
  description:
    "Create a glossy Frutiger Aero profile picture (PFP / avatar). Put your photo, initials, or an emoji on a dreamy Aero scene with a shiny sheen and iridescent bubble rim, in circle or rounded-square shape. Download a high-res transparent PNG.",
  keywords: [
    "frutiger aero pfp",
    "aero profile picture generator",
    "glossy avatar generator",
    "frutiger aero avatar",
    "discord pfp aero",
    "aero profile picture maker",
    "bubble pfp generator",
    "glossy profile picture",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: ogTitle("Frutiger Aero PFP Generator"),
    description:
      "Create a glossy Frutiger Aero profile picture — photo, initials, or emoji on an Aero scene with a shiny sheen and iridescent rim. Download a transparent PNG.",
    url: `${SITE_URL}/pfp`,
  },
  twitter: {
    ...defaultTwitter,
    title: ogTitle("Frutiger Aero PFP Generator"),
    description:
      "Create a glossy Frutiger Aero profile picture — photo, initials, or emoji on an Aero scene with a shiny sheen and iridescent rim. Download a transparent PNG.",
  },
  alternates: {
    canonical: `${SITE_URL}/pfp`,
  },
};

export default function PfpGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PFP_JSONLD) }}
      />
      <PfpClient />
    </>
  );
}
