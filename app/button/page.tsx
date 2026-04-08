import { Metadata } from "next";
import { SITE_URL, ogTitle, defaultOpenGraph, defaultTwitter, webAppJsonLd } from "@/lib/seo";
import ButtonClient from "./button-client";

const BUTTON_JSONLD = webAppJsonLd({
  name: "Frutiger Aero Button Generator",
  description:
    "Free CSS generator for authentic Frutiger Aero glossy buttons. Customize color, size, glow intensity, and saturation with a live preview.",
  url: `${SITE_URL}/button`,
});

export const metadata: Metadata = {
  title: "Frutiger Aero Button Generator",
  description:
    "Free CSS generator for authentic Frutiger Aero glossy buttons. Customize color, size, glow intensity, and saturation with a live preview. Copy ready-to-use CSS and HTML.",
  keywords: [
    "frutiger aero button",
    "aero glass button CSS",
    "glossy button generator",
    "Windows 7 button style",
    "CSS button maker",
    "aero button CSS",
    "glass button generator",
    "OKLCH button CSS",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: ogTitle("Frutiger Aero Button Generator"),
    description:
      "Generate authentic Frutiger Aero-style glossy buttons with CSS. Customize colors, sizes, and glow effects with live preview.",
    url: `${SITE_URL}/button`,
  },
  twitter: {
    ...defaultTwitter,
    title: ogTitle("Frutiger Aero Button Generator"),
    description:
      "Generate authentic Frutiger Aero-style glossy buttons with CSS. Customize colors, sizes, and glow effects with live preview.",
  },
  alternates: {
    canonical: `${SITE_URL}/button`,
  },
};

export default function ButtonGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUTTON_JSONLD) }}
      />
      <ButtonClient />
    </>
  );
}
