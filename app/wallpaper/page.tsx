import { Metadata } from "next";
import { SITE_URL, ogTitle, defaultOpenGraph, defaultTwitter, webAppJsonLd } from "@/lib/seo";
import WallpaperClient from "./wallpaper-client";

const WALLPAPER_JSONLD = webAppJsonLd({
  name: "Frutiger Aero Wallpaper Generator",
  description:
    "Free tool for generating authentic Frutiger Aero desktop wallpapers — glowing sky gradients, iridescent floating bubbles, and soft bokeh light. Download as PNG or copy a CSS background.",
  url: `${SITE_URL}/wallpaper`,
});

export const metadata: Metadata = {
  title: "Frutiger Aero Wallpaper Generator",
  description:
    "Generate authentic Frutiger Aero desktop wallpapers with glowing sky gradients, iridescent soap bubbles, and bokeh light. Download high-res PNGs or copy a CSS background.",
  keywords: [
    "frutiger aero wallpaper",
    "frutiger aero background generator",
    "aero bubble wallpaper",
    "windows vista wallpaper generator",
    "bokeh wallpaper maker",
    "aero sky background CSS",
    "iridescent bubble generator",
    "aero desktop background",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: ogTitle("Frutiger Aero Wallpaper Generator"),
    description:
      "Generate authentic Frutiger Aero desktop wallpapers — glowing skies, iridescent bubbles, and bokeh light. Download as PNG.",
    url: `${SITE_URL}/wallpaper`,
  },
  twitter: {
    ...defaultTwitter,
    title: ogTitle("Frutiger Aero Wallpaper Generator"),
    description:
      "Generate authentic Frutiger Aero desktop wallpapers — glowing skies, iridescent bubbles, and bokeh light. Download as PNG.",
  },
  alternates: {
    canonical: `${SITE_URL}/wallpaper`,
  },
};

export default function WallpaperGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WALLPAPER_JSONLD) }}
      />
      <WallpaperClient />
    </>
  );
}
