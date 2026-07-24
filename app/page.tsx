import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, defaultOpenGraph, defaultTwitter, websiteJsonLd } from "@/lib/seo";
import { AeroBackground } from "@/components/aero-background";
import Link from "next/link";
import { MousePointerClick, Circle, AppWindow, Image as ImageIcon, CircleUser } from "lucide-react";

const HOME_TITLE = `${SITE_NAME} - Frutiger Aero Style Generator`;
const HOME_DESCRIPTION =
  "Your go-to tools for creating authentic Frutiger Aero styles — glossy buttons, shiny orbs, glass window frames, dreamy wallpapers, and profile pictures, all customizable and filled with nostalgia.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  keywords: [
    "frutiger aero",
    "aero style generator",
    "frutiger aero CSS",
    "Windows 7 aero",
    "glossy UI CSS",
    "aero glass effect",
    "glass morphism",
    "aero design tools",
    "frutiger aero wallpaper generator",
    "frutiger aero pfp generator",
    "aero profile picture",
    "soap bubble CSS",
  ],
  openGraph: {
    ...defaultOpenGraph,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    ...defaultTwitter,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const features = [
  {
    href: "/button",
    icon: MousePointerClick,
    title: "Button Generator",
    description:
      "Create authentic Frutiger Aero-style buttons with customizable sizes, colors, and glossy effects.",
    preview: (
      <div
        className="relative rounded-full w-28 h-10 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, oklch(45% 0.2 140 / 0.75), oklch(75% 0.2 140 / 0.8))",
          boxShadow: "0 4px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="top-[4%] right-3 left-3 absolute rounded-full h-[40%]"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.1))",
          }}
        />
        <span className="absolute inset-0 flex justify-center items-center font-bold text-green-950 text-xs">
          Accept
        </span>
      </div>
    ),
  },
  {
    href: "/orb",
    icon: Circle,
    title: "Glossy Orb Generator",
    description:
      "Generate glossy orb effects — as CSS code or as an image with your own logo embedded inside.",
    preview: (
      <div
        className="relative rounded-full w-16 h-16"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), oklch(65% 0.15 245) 50%, oklch(35% 0.15 245) 100%)",
          boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: "8%",
            left: "18%",
            width: "45%",
            height: "35%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
            transform: "rotate(-20deg)",
          }}
        />
      </div>
    ),
  },
  {
    href: "/window-glass",
    icon: AppWindow,
    title: "Window Glass Generator",
    description:
      "Generate Windows 7 Aero-style glass window frames with customizable content and glass effects.",
    preview: (
      <div className="rounded-md w-32 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        <div
          className="flex items-center gap-1 px-1.5 h-5"
          style={{
            background: "linear-gradient(to bottom, rgba(80,130,200,0.7), rgba(30,60,120,0.8))",
          }}
        >
          <span className="flex-1 text-[6px] text-white/90 truncate">Untitled</span>
          <div className="flex gap-0.5">
            <div className="bg-white/20 rounded-sm w-2.5 h-2" />
            <div className="bg-white/20 rounded-sm w-2.5 h-2" />
            <div className="bg-red-400/60 rounded-sm w-2.5 h-2" />
          </div>
        </div>
        <div className="bg-white h-10" />
      </div>
    ),
  },
  {
    href: "/wallpaper",
    icon: ImageIcon,
    title: "Wallpaper Generator",
    description:
      "Generate the iconic Frutiger Aero desktop wallpaper — glowing sky gradients, iridescent bubbles, and bokeh light.",
    preview: (
      <div
        className="relative rounded-md w-32 h-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(205, 82%, 55%) 0%, hsl(205, 60%, 78%) 45%, hsl(205, 30%, 92%) 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute rounded-full w-6 h-6"
          style={{
            top: "20%",
            left: "20%",
            background: "conic-gradient(from 200deg, #ff9696, #ffdc8c, #aaffb4, #8cdcff, #be96ff, #ff96dc, #ff9696)",
            opacity: 0.6,
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute rounded-full w-3 h-3"
          style={{ top: "55%", left: "60%", background: "rgba(255,255,255,0.5)" }}
        />
        <div
          className="absolute rounded-full w-2 h-2"
          style={{ top: "35%", left: "70%", background: "rgba(255,255,255,0.4)" }}
        />
      </div>
    ),
  },
  {
    href: "/pfp",
    icon: CircleUser,
    title: "PFP Generator",
    description:
      "Make a glossy Aero profile picture — your photo, initials, or an emoji on a dreamy scene with an iridescent bubble rim.",
    preview: (
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 74% 20%, rgba(255,255,255,0.85), transparent 45%), linear-gradient(to bottom, hsl(205,82%,56%), hsl(205,55%,80%))",
            boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            padding: "3px",
            background:
              "conic-gradient(from 150deg, #ff9db0, #ffd27f, #b6f7aa, #8fd4ff, #c3a3ff, #ff9edd, #ff9db0)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          }}
        />
        <span className="absolute inset-0 flex justify-center items-center font-bold text-white text-lg" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          AE
        </span>
        <div
          className="absolute rounded-full"
          style={{ top: "10%", left: "18%", width: "55%", height: "32%", background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.75), transparent 70%)" }}
        />
      </div>
    ),
  },
];

export default function HomePage() {
  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-16 min-h-[calc(100vh-3.5rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <div className="mx-auto w-full max-w-4xl">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="aero-title mb-4 font-bold text-5xl">
            Make Aero
          </h1>
          <p className="aero-subtitle mx-auto max-w-xl text-lg">
            Your go-to tools for creating authentic Frutiger Aero styles -
            glossy buttons, shiny orbs, and glass window frames, all
            customizable and filled with nostalgia.
          </p>
          <p className="mt-2 text-slate-700 text-sm">
            A project by{" "}
            <a href="https://visnalize.com" target="_blank" className="text-brand-dark hover:underline">
              Visnalize
            </a>
          </p>
        </div>

        {/* Feature cards */}
        <div className="gap-6 grid md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group block"
            >
              <div className="aero-glass p-6 h-full transition-all group-hover:-translate-y-1 duration-300 group-hover:shadow-[0_16px_40px_rgba(29,84,148,0.28)]">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex justify-center items-center rounded-xl w-9 h-9 text-white shrink-0"
                    style={{
                      background: "linear-gradient(to bottom, #16c6a6, #0a8f75)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(10,100,82,0.4)",
                    }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-slate-800">{feature.title}</h2>
                </div>
                <div className="flex justify-center items-center py-6">
                  {feature.preview}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AeroBackground>
  );
}
