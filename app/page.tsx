import { AeroBackground } from "@/components/aero-background";
import Link from "next/link";
import { MousePointerClick, Circle, AppWindow } from "lucide-react";

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
];

export default function HomePage() {
  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-16 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-4xl">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-slate-800 text-5xl">
            Make Aero
          </h1>
          <p className="mx-auto max-w-xl text-slate-600 text-lg">
            Your go-to tools for creating authentic Frutiger Aero styles —
            glossy buttons, shiny orbs, and glass window frames, all
            customizable and filled with nostalgia.
          </p>
          <p className="mt-2 text-slate-500 text-sm">
            A project by{" "}
            <a href="https://visnalize.com" target="_blank" className="text-blue-600 hover:underline">
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
              <div className="bg-white/80 hover:bg-white/95 hover:shadow-blue-100/50 hover:shadow-lg backdrop-blur-sm p-6 border border-white/40 rounded-2xl h-full transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-slate-800">{feature.title}</h2>
                </div>
                <div className="flex justify-center items-center py-6">
                  {feature.preview}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
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
