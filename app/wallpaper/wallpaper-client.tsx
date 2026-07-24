"use client";

import { AeroBackground } from "@/components/aero-background";
import { CodeOutput } from "@/components/code-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shuffle, Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Env = "day" | "underwater" | "night";
type SunPos = "left" | "center" | "right";

const resolutionPresets: Record<string, { label: string; w: number; h: number }> = {
  hd: { label: "Desktop HD (1920×1080)", w: 1920, h: 1080 },
  qhd: { label: "Desktop 2K (2560×1440)", w: 2560, h: 1440 },
  square: { label: "Square (1080×1080)", w: 1080, h: 1080 },
  mobile: { label: "Mobile (1080×1920)", w: 1080, h: 1920 },
};

const colorPresets: Record<string, { label: string; hue: number }> = {
  sky: { label: "Sky Blue", hue: 205 },
  ocean: { label: "Ocean Teal", hue: 185 },
  meadow: { label: "Meadow Green", hue: 135 },
  twilight: { label: "Twilight Purple", hue: 265 },
  sunset: { label: "Sunset Coral", hue: 20 },
};

const envPresets: Record<Env, string> = {
  day: "Day Sky",
  underwater: "Underwater",
  night: "Night",
};

interface ScenePreset {
  label: string;
  env: Env;
  hue: number;
  sun: SunPos;
  bubbles: number;
  bokeh: number;
  clouds: number;
  rays: boolean;
  showClouds: boolean;
  horizon: boolean;
  aurora: boolean;
  vignette: boolean;
}

const scenePresets: Record<string, ScenePreset> = {
  clearSky: { label: "Clear Sky", env: "day", hue: 205, sun: "right", bubbles: 10, bokeh: 40, clouds: 4, rays: true, showClouds: true, horizon: false, aurora: false, vignette: true },
  meadow: { label: "Meadow", env: "day", hue: 205, sun: "right", bubbles: 8, bokeh: 30, clouds: 5, rays: true, showClouds: true, horizon: true, aurora: false, vignette: true },
  sunset: { label: "Sunset", env: "day", hue: 18, sun: "center", bubbles: 8, bokeh: 35, clouds: 5, rays: true, showClouds: true, horizon: false, aurora: false, vignette: true },
  underwater: { label: "Underwater", env: "underwater", hue: 195, sun: "center", bubbles: 18, bokeh: 55, clouds: 0, rays: true, showClouds: false, horizon: false, aurora: false, vignette: true },
  aurora: { label: "Aurora Night", env: "night", hue: 225, sun: "center", bubbles: 5, bokeh: 80, clouds: 0, rays: false, showClouds: false, horizon: false, aurora: true, vignette: true },
};

const sunX: Record<SunPos, number> = { left: 0.18, center: 0.5, right: 0.82 };

// Deterministic PRNG so a given seed always reproduces the same layout.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Bubble { x: number; y: number; r: number; hueShift: number; op: number; }
interface Bokeh { x: number; y: number; r: number; op: number; tint: number; }
interface Cloud { x: number; y: number; scale: number; op: number; }
interface Ribbon { x: number; hue: number; phase: number; amp: number; width: number; }

function buildLayout(seed: number, bubbleCount: number, bokehCount: number, cloudCount: number) {
  const rand = mulberry32(seed);
  const bubbles: Bubble[] = Array.from({ length: bubbleCount }, () => ({
    x: rand(), y: rand() * 0.85 + 0.05, r: 0.025 + rand() * 0.055, hueShift: rand() * 360, op: 0.5 + rand() * 0.35,
  }));
  const bokeh: Bokeh[] = Array.from({ length: bokehCount }, () => ({
    x: rand(), y: rand(), r: 0.008 + rand() * 0.03, op: 0.06 + rand() * 0.2, tint: rand(),
  }));
  const clouds: Cloud[] = Array.from({ length: cloudCount }, () => ({
    x: rand(), y: 0.1 + rand() * 0.4, scale: 0.6 + rand() * 0.9, op: 0.5 + rand() * 0.4,
  }));
  const ribbons: Ribbon[] = Array.from({ length: 3 }, (_, i) => ({
    x: 0.2 + i * 0.3 + (rand() - 0.5) * 0.1, hue: 120 + rand() * 60 + i * 40, phase: rand() * Math.PI * 2, amp: 0.04 + rand() * 0.05, width: 0.06 + rand() * 0.05,
  }));
  return { bubbles, bokeh, clouds, ribbons };
}

interface DrawOpts {
  env: Env;
  hue: number;
  sun: SunPos;
  showRays: boolean;
  showClouds: boolean;
  showHorizon: boolean;
  showAurora: boolean;
  vignette: boolean;
  grain: boolean;
  bubbles: Bubble[];
  bokeh: Bokeh[];
  clouds: Cloud[];
  ribbons: Ribbon[];
}

function drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 128;
  const tctx = tile.getContext("2d");
  if (!tctx) return;
  const img = tctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  const pat = ctx.createPattern(tile, "repeat");
  if (!pat) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawWallpaper(canvas: HTMLCanvasElement, w: number, h: number, o: DrawOpts) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { env, hue, sun, showRays, showClouds, showHorizon, showAurora, vignette, grain } = o;
  const minDim = Math.min(w, h);
  const maxDim = Math.max(w, h);
  const warm = hue < 45 || hue > 330; // sunset-ish palette

  // --- Base environment gradient ---
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (env === "underwater") {
    sky.addColorStop(0, `hsl(${hue}, 78%, 58%)`);
    sky.addColorStop(0.5, `hsl(${hue}, 72%, 32%)`);
    sky.addColorStop(1, `hsl(${hue + 8}, 78%, 12%)`);
  } else if (env === "night") {
    sky.addColorStop(0, `hsl(${hue + 5}, 60%, 7%)`);
    sky.addColorStop(0.55, `hsl(${hue}, 52%, 14%)`);
    sky.addColorStop(1, `hsl(${hue - 8}, 46%, 24%)`);
  } else {
    sky.addColorStop(0, `hsl(${hue}, 82%, 52%)`);
    sky.addColorStop(0.4, `hsl(${hue}, 65%, 72%)`);
    sky.addColorStop(0.75, `hsl(${hue}, 35%, 90%)`);
    sky.addColorStop(1, `hsl(${hue}, 20%, 97%)`);
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glowX = w * sunX[sun];
  const glowY = h * 0.16;

  // --- Aurora ribbons (night) ---
  if (showAurora && env === "night") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = `blur(${Math.round(maxDim * 0.012)}px)`;
    for (const rb of o.ribbons) {
      const cx = rb.x * w;
      const ribW = rb.width * w;
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      grad.addColorStop(0, `hsla(${rb.hue}, 90%, 65%, 0)`);
      grad.addColorStop(0.4, `hsla(${rb.hue}, 90%, 62%, 0.55)`);
      grad.addColorStop(0.7, `hsla(${rb.hue + 40}, 90%, 65%, 0.35)`);
      grad.addColorStop(1, `hsla(${rb.hue + 60}, 90%, 68%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = t * h * 0.72;
        const off = Math.sin(rb.phase + t * 6) * rb.amp * w;
        const x = cx + off - ribW / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const t = i / steps;
        const y = t * h * 0.72;
        const off = Math.sin(rb.phase + t * 6) * rb.amp * w;
        const x = cx + off + ribW / 2;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Horizon / grass band (day) ---
  if (showHorizon && env === "day") {
    const grassTop = h * 0.76;
    const grass = ctx.createLinearGradient(0, grassTop, 0, h);
    grass.addColorStop(0, "hsla(128, 55%, 55%, 0)");
    grass.addColorStop(0.2, "hsla(128, 55%, 42%, 0.9)");
    grass.addColorStop(1, "hsla(122, 62%, 26%, 0.97)");
    ctx.fillStyle = grass;
    ctx.fillRect(0, grassTop, w, h - grassTop);
    const haze = ctx.createLinearGradient(0, grassTop - h * 0.08, 0, grassTop + h * 0.04);
    haze.addColorStop(0, "rgba(255,255,255,0)");
    haze.addColorStop(1, "rgba(255,255,255,0.55)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, grassTop - h * 0.08, w, h * 0.12);
  }

  // --- Light source ---
  if (env !== "night") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const bloom = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, maxDim * 0.45);
    const bloomColor = warm ? "255,238,205" : "255,255,255";
    bloom.addColorStop(0, `rgba(${bloomColor},0.9)`);
    bloom.addColorStop(0.3, `rgba(${bloomColor},0.35)`);
    bloom.addColorStop(1, `rgba(${bloomColor},0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // --- Rays ---
  if (showRays) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    if (env === "underwater") {
      // Vertical god-rays descending from the surface
      const shafts = 7;
      for (let i = 0; i < shafts; i++) {
        const x = (i / shafts) * w + (i % 2) * w * 0.03;
        const sw = w * (0.02 + (i % 3) * 0.015);
        const g = ctx.createLinearGradient(x, 0, x + w * 0.12, h);
        g.addColorStop(0, "rgba(255,255,255,0.28)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + sw, 0);
        ctx.lineTo(x + sw + w * 0.14, h);
        ctx.lineTo(x + w * 0.14, h);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.translate(glowX, glowY);
      const rayCount = 6;
      const length = maxDim * 1.3;
      const rayColor = warm ? "255,236,200" : "255,255,255";
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + 0.3;
        const spread = 0.07 + (i % 2) * 0.03;
        ctx.save();
        ctx.rotate(angle);
        const rg = ctx.createLinearGradient(0, 0, length, 0);
        rg.addColorStop(0, `rgba(${rayColor},0.3)`);
        rg.addColorStop(1, `rgba(${rayColor},0)`);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, -length * Math.tan(spread));
        ctx.lineTo(length, length * Math.tan(spread));
        ctx.closePath();
        ctx.fillStyle = rg;
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // --- Clouds (day) ---
  if (showClouds && env === "day") {
    ctx.save();
    ctx.filter = `blur(${Math.round(minDim * 0.012)}px)`;
    for (const c of o.clouds) {
      const cx = c.x * w;
      const cy = c.y * h;
      const base = minDim * 0.09 * c.scale;
      const tint = warm ? `rgba(255,235,215,${c.op})` : `rgba(255,255,255,${c.op})`;
      ctx.fillStyle = tint;
      const puffs = [
        [0, 0, base], [base * 0.9, base * 0.15, base * 0.75], [-base * 0.9, base * 0.2, base * 0.7],
        [base * 0.4, -base * 0.35, base * 0.65], [-base * 0.4, -base * 0.25, base * 0.6],
        [base * 1.7, base * 0.3, base * 0.5], [-base * 1.6, base * 0.3, base * 0.5],
      ];
      for (const [dx, dy, r] of puffs) {
        ctx.beginPath();
        ctx.ellipse(cx + dx, cy + dy, r, r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Flat, slightly shaded base
      ctx.fillStyle = warm ? `rgba(240,210,200,${c.op * 0.5})` : `rgba(210,228,242,${c.op * 0.5})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy + base * 0.5, base * 2.1, base * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Bokeh / stars ---
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const b of o.bokeh) {
    const bx = b.x * w;
    const by = b.y * h;
    const br = b.r * minDim * (env === "night" ? 0.5 : 1);
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    const color = b.tint > 0.6 ? `hsla(${hue}, 70%, 80%, ${b.op})` : `rgba(255,255,255,${b.op})`;
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
  ctx.restore();

  // --- Bubbles (crisp, iridescent) ---
  for (const bub of o.bubbles) {
    const bx = bub.x * w;
    const by = bub.y * h;
    const br = bub.r * minDim;

    const fill = ctx.createRadialGradient(bx, by, br * 0.1, bx, by, br);
    fill.addColorStop(0, "rgba(255,255,255,0.32)");
    fill.addColorStop(0.7, "rgba(255,255,255,0.08)");
    fill.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const segments = 48;
    const rimWidth = Math.max(1, br * 0.14);
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      const rimHue = ((i / segments) * 360 + bub.hueShift) % 360;
      ctx.beginPath();
      ctx.arc(bx, by, br - rimWidth / 2, a0, a1 + 0.02);
      ctx.strokeStyle = `hsla(${rimHue}, 90%, 75%, ${bub.op * 0.6})`;
      ctx.lineWidth = rimWidth;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(bx - br * 0.28, by - br * 0.32);
    ctx.rotate(-0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, br * 0.28, br * 0.2, 0, 0, Math.PI * 2);
    const spec = ctx.createRadialGradient(0, 0, 0, 0, 0, br * 0.28);
    spec.addColorStop(0, `rgba(255,255,255,${Math.min(bub.op + 0.3, 1)})`);
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.fill();
    ctx.restore();
  }

  // --- Vignette ---
  if (vignette) {
    const strength = env === "day" ? 0.12 : 0.32;
    const vig = ctx.createRadialGradient(w / 2, h / 2, minDim * 0.35, w / 2, h / 2, maxDim * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }

  // --- Film grain ---
  if (grain) drawGrain(ctx, w, h, 0.06);
}

export default function WallpaperClient() {
  const [resolution, setResolution] = useState("hd");
  const [scene, setScene] = useState("clearSky");
  const [env, setEnv] = useState<Env>("day");
  const [selectedColor, setSelectedColor] = useState("sky");
  const [customHue, setCustomHue] = useState([205]);
  const [sun, setSun] = useState<SunPos>("right");
  const [bubbleCount, setBubbleCount] = useState([10]);
  const [bokehCount, setBokehCount] = useState([40]);
  const [cloudCount, setCloudCount] = useState([4]);
  const [showRays, setShowRays] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showHorizon, setShowHorizon] = useState(false);
  const [showAurora, setShowAurora] = useState(false);
  const [vignette, setVignette] = useState(true);
  const [grain, setGrain] = useState(false);
  const [seed, setSeed] = useState(42);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { w: fullW, h: fullH } = resolutionPresets[resolution];
  const hue = selectedColor === "custom" ? customHue[0] : colorPresets[selectedColor].hue;

  const applyScene = (key: string) => {
    setScene(key);
    if (key === "custom") return;
    const p = scenePresets[key];
    setEnv(p.env);
    setSelectedColor("custom");
    setCustomHue([p.hue]);
    setSun(p.sun);
    setBubbleCount([p.bubbles]);
    setBokehCount([p.bokeh]);
    setCloudCount([p.clouds]);
    setShowRays(p.rays);
    setShowClouds(p.showClouds);
    setShowHorizon(p.horizon);
    setShowAurora(p.aurora);
    setVignette(p.vignette);
  };

  const layout = useMemo(
    () => buildLayout(seed, bubbleCount[0], bokehCount[0], cloudCount[0]),
    [seed, bubbleCount, bokehCount, cloudCount]
  );

  const render = useCallback(
    (canvas: HTMLCanvasElement | null, w: number, h: number) => {
      if (!canvas) return;
      drawWallpaper(canvas, w, h, {
        env, hue, sun, showRays, showClouds, showHorizon, showAurora, vignette, grain,
        bubbles: layout.bubbles, bokeh: layout.bokeh, clouds: layout.clouds, ribbons: layout.ribbons,
      });
    },
    [env, hue, sun, showRays, showClouds, showHorizon, showAurora, vignette, grain, layout]
  );

  // Preview renders at a capped internal resolution so dragging stays snappy;
  // the full-resolution render only happens on download.
  useEffect(() => {
    const aspect = fullW / fullH;
    const maxSide = 640;
    const previewW = aspect >= 1 ? maxSide : Math.round(maxSide * aspect);
    const previewH = aspect >= 1 ? Math.round(maxSide / aspect) : maxSide;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.width = "100%";
      canvas.style.maxWidth = `${previewW}px`;
      canvas.style.height = "auto";
    }
    render(canvas, previewW, previewH);
  }, [render, fullW, fullH]);

  const handleDownload = () => {
    const offscreen = document.createElement("canvas");
    render(offscreen, fullW, fullH);
    const link = document.createElement("a");
    link.download = `frutiger-aero-wallpaper-${fullW}x${fullH}.png`;
    link.href = offscreen.toDataURL("image/png");
    link.click();
  };

  const generateCSS = () => {
    const previewBubbles = layout.bubbles.slice(0, 8);
    const previewBokeh = layout.bokeh.slice(0, 10);

    const bubbleLayers = previewBubbles
      .map(
        (b) =>
          `radial-gradient(circle at ${(b.x * 100).toFixed(1)}% ${(b.y * 100).toFixed(1)}%, rgba(255,255,255,${(b.op * 0.7).toFixed(2)}) 0%, hsla(${Math.round((b.hueShift + hue) % 360)}, 80%, 80%, ${(b.op * 0.25).toFixed(2)}) ${(b.r * 60).toFixed(0)}%, transparent ${(b.r * 130).toFixed(0)}%)`
      )
      .join(",\n    ");

    const bokehLayers = previewBokeh
      .map(
        (bk) =>
          `radial-gradient(circle at ${(bk.x * 100).toFixed(1)}% ${(bk.y * 100).toFixed(1)}%, rgba(255,255,255,${bk.op.toFixed(2)}), transparent ${(bk.r * 200).toFixed(0)}%)`
      )
      .join(",\n    ");

    let baseGradient: string;
    if (env === "underwater") {
      baseGradient = `linear-gradient(to bottom, hsl(${hue}, 78%, 58%) 0%, hsl(${hue}, 72%, 32%) 50%, hsl(${hue + 8}, 78%, 12%) 100%)`;
    } else if (env === "night") {
      baseGradient = `linear-gradient(to bottom, hsl(${hue + 5}, 60%, 7%) 0%, hsl(${hue}, 52%, 14%) 55%, hsl(${hue - 8}, 46%, 24%) 100%)`;
    } else {
      baseGradient = `linear-gradient(to bottom, hsl(${hue}, 82%, 52%) 0%, hsl(${hue}, 65%, 72%) 40%, hsl(${hue}, 35%, 90%) 75%, hsl(${hue}, 20%, 97%) 100%)`;
    }

    return `/* Frutiger Aero Wallpaper CSS — approximation of the PNG render */
/* Iridescent bubble rims, clouds, rays and aurora require the canvas PNG export */
.frutiger-aero-wallpaper {
  width: 100%;
  aspect-ratio: ${fullW} / ${fullH};
  background:
    ${bubbleLayers},
    ${bokehLayers},
    ${baseGradient};
}`;
  };

  const cloudsAvailable = env === "day";

  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-10 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="aero-title mb-3 font-bold text-4xl">
            Aero Wallpaper Generator
          </h1>
          <p className="aero-subtitle mx-auto mb-2 max-w-xl">
            Generate the iconic Frutiger Aero wallpaper — glowing skies, floating
            iridescent bubbles, drifting clouds, underwater god-rays and aurora
            nights. Download a high-res PNG or copy an approximate CSS background.
          </p>
        </div>

        <div className="gap-8 grid lg:grid-cols-2">
          {/* Controls */}
          <Card className="aero-glass">
            <CardHeader>
              <CardTitle>Wallpaper Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="scene">Scene Preset</Label>
                <Select value={scene} onValueChange={applyScene}>
                  <SelectTrigger id="scene">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(scenePresets).map(([key, p]) => (
                      <SelectItem key={key} value={key}>
                        {p.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">(Custom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resolution">Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger id="resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(resolutionPresets).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="env">Environment</Label>
                <Select
                  value={env}
                  onValueChange={(v) => {
                    setEnv(v as Env);
                    setScene("custom");
                  }}
                >
                  <SelectTrigger id="env">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(envPresets).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">
                  {env === "underwater" ? "Water Color" : env === "night" ? "Sky Tint" : "Sky Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedColor}
                    onValueChange={(v) => {
                      setSelectedColor(v);
                      setScene("custom");
                    }}
                  >
                    <SelectTrigger id="color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(colorPresets).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          {preset.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">(Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={selectedColor === "custom" ? "secondary" : "link"}
                    onClick={() => {
                      setSelectedColor(selectedColor === "custom" ? "sky" : "custom");
                      setScene("custom");
                    }}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {selectedColor === "custom" && (
                <div>
                  <Label>Custom Hue: {customHue[0]}°</Label>
                  <Slider
                    value={customHue}
                    onValueChange={(v) => {
                      setCustomHue(v);
                      setScene("custom");
                    }}
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}

              {env !== "night" && (
                <div>
                  <Label htmlFor="sun">Sun Position</Label>
                  <Select value={sun} onValueChange={(v) => { setSun(v as SunPos); setScene("custom"); }}>
                    <SelectTrigger id="sun">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Bubble Count: {bubbleCount[0]}</Label>
                <Slider value={bubbleCount} onValueChange={(v) => { setBubbleCount(v); setScene("custom"); }} max={24} min={0} step={1} className="mt-2" />
              </div>

              <div>
                <Label>{env === "night" ? "Star" : "Bokeh"} Count: {bokehCount[0]}</Label>
                <Slider value={bokehCount} onValueChange={(v) => { setBokehCount(v); setScene("custom"); }} max={100} min={0} step={5} className="mt-2" />
              </div>

              {cloudsAvailable && (
                <div>
                  <Label>Cloud Count: {cloudCount[0]}</Label>
                  <Slider value={cloudCount} onValueChange={(v) => { setCloudCount(v); setScene("custom"); }} max={8} min={0} step={1} className="mt-2" />
                </div>
              )}

              <div className="gap-x-6 gap-y-3 grid grid-cols-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showRays} onChange={(e) => { setShowRays(e.target.checked); setScene("custom"); }} className="rounded" />
                  <span className="text-sm">{env === "underwater" ? "God Rays" : "Light Rays"}</span>
                </label>

                {cloudsAvailable && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showClouds} onChange={(e) => { setShowClouds(e.target.checked); setScene("custom"); }} className="rounded" />
                      <span className="text-sm">Clouds</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showHorizon} onChange={(e) => { setShowHorizon(e.target.checked); setScene("custom"); }} className="rounded" />
                      <span className="text-sm">Horizon / Grass</span>
                    </label>
                  </>
                )}

                {env === "night" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showAurora} onChange={(e) => { setShowAurora(e.target.checked); setScene("custom"); }} className="rounded" />
                    <span className="text-sm">Aurora</span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={vignette} onChange={(e) => { setVignette(e.target.checked); setScene("custom"); }} className="rounded" />
                  <span className="text-sm">Vignette</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={grain} onChange={(e) => { setGrain(e.target.checked); setScene("custom"); }} className="rounded" />
                  <span className="text-sm">Film Grain</span>
                </label>
              </div>

              <Button variant="aeroSoft" onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))} className="w-full">
                <Shuffle className="mr-2 w-4 h-4" />
                Shuffle Layout
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="aero-glass">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center bg-slate-200/40 p-4 rounded-xl min-h-[400px]">
                <canvas ref={canvasRef} className="shadow-lg rounded-lg" />
              </div>
              <Button onClick={handleDownload} variant="aero" className="mt-4 w-full">
                <Download className="mr-2 w-4 h-4" />
                Download {fullW}×{fullH} PNG
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="my-8">
          <CodeOutput
            code={generateCSS()}
            language="css"
            copyButtons={[
              { label: "Copy CSS", text: generateCSS() },
              { label: "Copy HTML", text: `<div class="frutiger-aero-wallpaper"></div>`, variant: "outline" },
            ]}
          />
        </div>
      </div>
    </AeroBackground>
  );
}
