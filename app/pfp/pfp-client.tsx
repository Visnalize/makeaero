"use client";

import { AeroBackground } from "@/components/aero-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Download, Shuffle, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Shape = "circle" | "squircle";
type Content = "initials" | "emoji" | "image";
type Rim = "none" | "ring" | "bubble";

const scenes: Record<string, { label: string; hue: number }> = {
  sky: { label: "Sky", hue: 205 },
  meadow: { label: "Meadow", hue: 205 },
  underwater: { label: "Underwater", hue: 190 },
  sunset: { label: "Sunset", hue: 20 },
  aurora: { label: "Aurora Night", hue: 225 },
  solid: { label: "Solid Glossy", hue: 210 },
};

const sizePresets: Record<string, number> = {
  "256": 256,
  "512": 512,
  "1024": 1024,
};

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

function traceShape(ctx: CanvasRenderingContext2D, S: number, inset: number, shape: Shape) {
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(S / 2, S / 2, S / 2 - inset, 0, Math.PI * 2);
  } else {
    const r = S * 0.24;
    ctx.roundRect(inset, inset, S - inset * 2, S - inset * 2, r - inset);
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  S: number,
  scene: string,
  hue: number,
  rand: () => number
) {
  const warm = hue < 45 || hue > 330;

  if (scene === "solid") {
    // Glossy sphere-like fill
    const g = ctx.createRadialGradient(S * 0.38, S * 0.34, S * 0.05, S * 0.5, S * 0.55, S * 0.7);
    g.addColorStop(0, `hsl(${hue} 75% 72%)`);
    g.addColorStop(0.55, `hsl(${hue} 70% 52%)`);
    g.addColorStop(1, `hsl(${hue} 72% 32%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return;
  }

  // Base vertical gradient per environment
  const sky = ctx.createLinearGradient(0, 0, 0, S);
  if (scene === "underwater") {
    sky.addColorStop(0, `hsl(${hue} 78% 58%)`);
    sky.addColorStop(0.5, `hsl(${hue} 72% 34%)`);
    sky.addColorStop(1, `hsl(${hue + 8} 78% 14%)`);
  } else if (scene === "aurora") {
    sky.addColorStop(0, `hsl(${hue + 5} 60% 8%)`);
    sky.addColorStop(0.55, `hsl(${hue} 52% 15%)`);
    sky.addColorStop(1, `hsl(${hue - 8} 46% 26%)`);
  } else {
    sky.addColorStop(0, `hsl(${hue} 82% 54%)`);
    sky.addColorStop(0.45, `hsl(${hue} 66% 72%)`);
    sky.addColorStop(1, `hsl(${hue} 40% 92%)`);
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, S, S);

  // Meadow grass foot
  if (scene === "meadow") {
    const gTop = S * 0.72;
    const grass = ctx.createLinearGradient(0, gTop, 0, S);
    grass.addColorStop(0, "hsla(128,55%,52%,0)");
    grass.addColorStop(0.25, "hsla(128,55%,42%,0.95)");
    grass.addColorStop(1, "hsl(122,62%,26%)");
    ctx.fillStyle = grass;
    ctx.fillRect(0, gTop, S, S - gTop);
  }

  // Aurora ribbons
  if (scene === "aurora") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = `blur(${Math.round(S * 0.02)}px)`;
    for (let i = 0; i < 3; i++) {
      const cx = S * (0.25 + i * 0.28);
      const rH = 120 + i * 45 + rand() * 40;
      const grad = ctx.createLinearGradient(0, 0, 0, S * 0.75);
      grad.addColorStop(0, `hsla(${rH},90%,65%,0)`);
      grad.addColorStop(0.5, `hsla(${rH},90%,62%,0.6)`);
      grad.addColorStop(1, `hsla(${rH + 50},90%,66%,0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = S * 0.06;
      ctx.beginPath();
      for (let s = 0; s <= 24; s++) {
        const t = s / 24;
        const x = cx + Math.sin(t * 6 + i) * S * 0.06;
        const y = t * S * 0.78;
        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Light bloom (day/sunset)
  if (scene !== "aurora") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const gx = S * 0.74;
    const gy = S * 0.2;
    const col = warm ? "255,235,200" : "255,255,255";
    const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, S * 0.6);
    bloom.addColorStop(0, `rgba(${col},0.85)`);
    bloom.addColorStop(0.35, `rgba(${col},0.3)`);
    bloom.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
  }

  // Underwater god-rays
  if (scene === "underwater") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 5; i++) {
      const x = (i / 5) * S + rand() * S * 0.05;
      const w = S * (0.03 + (i % 2) * 0.02);
      const g = ctx.createLinearGradient(x, 0, x + S * 0.14, S);
      g.addColorStop(0, "rgba(255,255,255,0.3)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + w, 0);
      ctx.lineTo(x + w + S * 0.16, S);
      ctx.lineTo(x + S * 0.16, S);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Bokeh
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const bokehN = scene === "aurora" ? 26 : 16;
  for (let i = 0; i < bokehN; i++) {
    const bx = rand() * S;
    const by = rand() * S;
    const br = S * (0.006 + rand() * 0.03);
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    g.addColorStop(0, `rgba(255,255,255,${0.1 + rand() * 0.35})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // A few iridescent bubbles
  const bubbleN = 5;
  for (let i = 0; i < bubbleN; i++) {
    const bx = rand() * S;
    const by = rand() * S * 0.9 + S * 0.05;
    const br = S * (0.04 + rand() * 0.07);
    const hueShift = rand() * 360;
    const op = 0.5 + rand() * 0.3;

    const fill = ctx.createRadialGradient(bx, by, br * 0.1, bx, by, br);
    fill.addColorStop(0, "rgba(255,255,255,0.3)");
    fill.addColorStop(0.7, "rgba(255,255,255,0.07)");
    fill.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const seg = 40;
    const rimW = Math.max(1, br * 0.16);
    for (let s = 0; s < seg; s++) {
      const a0 = (s / seg) * Math.PI * 2;
      const a1 = ((s + 1) / seg) * Math.PI * 2;
      const rh = ((s / seg) * 360 + hueShift) % 360;
      ctx.beginPath();
      ctx.arc(bx, by, br - rimW / 2, a0, a1 + 0.02);
      ctx.strokeStyle = `hsla(${rh},90%,75%,${op * 0.6})`;
      ctx.lineWidth = rimW;
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(bx - br * 0.3, by - br * 0.32, br * 0.24, br * 0.16, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.min(op + 0.25, 1)})`;
    ctx.fill();
  }
}

interface RenderOpts {
  shape: Shape;
  content: Content;
  scene: string;
  hue: number;
  initials: string;
  initialsColor: string;
  emoji: string;
  gloss: number; // 0..1, 0 = off
  rim: Rim;
  image: HTMLImageElement | null;
  seed: number;
}

function render(canvas: HTMLCanvasElement, S: number, o: RenderOpts) {
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, S, S);
  const rand = mulberry32(o.seed);

  // Clip to shape
  ctx.save();
  traceShape(ctx, S, 0, o.shape);
  ctx.clip();

  // Background scene
  drawBackground(ctx, S, o.scene, o.hue, rand);

  // Image subject (cover-fit), drawn over the background
  if (o.content === "image" && o.image) {
    const img = o.image;
    const ar = img.width / img.height;
    let dw = S, dh = S;
    if (ar > 1) { dh = S; dw = S * ar; } else { dw = S; dh = S / ar; }
    ctx.drawImage(img, (S - dw) / 2, (S - dh) / 2, dw, dh);
  }

  // Text subject
  if (o.content === "initials" && o.initials.trim()) {
    ctx.fillStyle = o.initialsColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.round(S * 0.4)}px "Segoe UI", "Myriad Pro", system-ui, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = S * 0.02;
    ctx.shadowOffsetY = S * 0.01;
    ctx.fillText(o.initials.trim().slice(0, 2).toUpperCase(), S / 2, S * 0.54);
    ctx.shadowColor = "transparent";
  }
  if (o.content === "emoji" && o.emoji.trim()) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(S * 0.56)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText([...o.emoji.trim()][0] ?? "", S / 2, S * 0.54);
  }

  // Glossy sheen (Web 2.0 badge dome)
  if (o.gloss > 0) {
    const grad = ctx.createLinearGradient(0, 0, 0, S * 0.62);
    grad.addColorStop(0, `rgba(255,255,255,${0.6 * o.gloss})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(S / 2, S * 0.1, S * 0.66, S * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // end clip

  // Rim (drawn on top, inset so the full stroke stays visible)
  if (o.rim !== "none") {
    const lw = o.rim === "bubble" ? S * 0.05 : S * 0.045;
    if (o.rim === "ring") {
      traceShape(ctx, S, lw / 2, o.shape);
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.5, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(120,150,180,0.85)");
      ctx.strokeStyle = g;
      ctx.lineWidth = lw;
      ctx.stroke();
      // inner highlight
      traceShape(ctx, S, lw + 1, o.shape);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = Math.max(1, S * 0.006);
      ctx.stroke();
    } else {
      // Iridescent bubble rim via conic rainbow
      traceShape(ctx, S, lw / 2, o.shape);
      const conic = ctx.createConicGradient(2.6, S / 2, S / 2);
      const stops = [0, 45, 130, 200, 270, 320, 360];
      stops.forEach((deg) =>
        conic.addColorStop(deg / 360, `hsla(${deg}, 90%, 72%, 0.95)`)
      );
      ctx.strokeStyle = conic;
      ctx.lineWidth = lw;
      ctx.stroke();
      // glassy inner + outer highlight
      traceShape(ctx, S, lw + 1, o.shape);
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = Math.max(1, S * 0.008);
      ctx.stroke();
    }
  }
}

export default function PfpClient() {
  const [shape, setShape] = useState<Shape>("circle");
  const [content, setContent] = useState<Content>("initials");
  const [scene, setScene] = useState("sky");
  const [customHue, setCustomHue] = useState([205]);
  const [useCustomHue, setUseCustomHue] = useState(false);
  const [initials, setInitials] = useState("AE");
  const [initialsColor, setInitialsColor] = useState("#ffffff");
  const [emoji, setEmoji] = useState("🫧");
  const [gloss, setGloss] = useState([0.85]);
  const [rim, setRim] = useState<Rim>("bubble");
  const [size, setSize] = useState("512");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [seed, setSeed] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hue = useCustomHue ? customHue[0] : scenes[scene].hue;
  const S = sizePresets[size];

  const opts: RenderOpts = useMemo(
    () => ({
      shape, content, scene, hue, initials, initialsColor, emoji,
      gloss: gloss[0], rim, image, seed,
    }),
    [shape, content, scene, hue, initials, initialsColor, emoji, gloss, rim, image, seed]
  );

  const draw = useCallback(() => {
    if (canvasRef.current) render(canvasRef.current, S, opts);
  }, [S, opts]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageName(file.name);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setContent("image");
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `aero-pfp-${S}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-10 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="aero-title mb-3 font-bold text-4xl">
            Aero PFP Generator
          </h1>
          <p className="aero-subtitle mx-auto mb-2 max-w-xl">
            Make a glossy Frutiger Aero profile picture — your photo, initials or
            an emoji on a dreamy Aero scene, finished with a shiny sheen and an
            iridescent bubble rim. Download a transparent PNG.
          </p>
        </div>

        <div className="gap-8 grid lg:grid-cols-2">
          {/* Controls */}
          <Card className="aero-glass">
            <CardHeader>
              <CardTitle>PFP Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Shape</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={shape}
                  onValueChange={(v) => v && setShape(v as Shape)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="circle">Circle</ToggleGroupItem>
                  <ToggleGroupItem value="squircle">Rounded Square</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div>
                <Label>Content</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={content}
                  onValueChange={(v) => v && setContent(v as Content)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="initials">Initials</ToggleGroupItem>
                  <ToggleGroupItem value="emoji">Emoji</ToggleGroupItem>
                  <ToggleGroupItem value="image">Image</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {content === "initials" && (
                <div className="gap-3 grid grid-cols-[1fr_auto]">
                  <div>
                    <Label htmlFor="initials">Initials</Label>
                    <Input
                      id="initials"
                      value={initials}
                      maxLength={2}
                      onChange={(e) => setInitials(e.target.value)}
                      placeholder="AE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ic">Color</Label>
                    <input
                      id="ic"
                      type="color"
                      value={initialsColor}
                      onChange={(e) => setInitialsColor(e.target.value)}
                      className="mt-1 border border-white/60 rounded-md w-12 h-10 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {content === "emoji" && (
                <div>
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="🫧"
                  />
                </div>
              )}

              {content === "image" && (
                <div>
                  <Label>Photo / Logo</Label>
                  <div
                    className="hover:bg-white/40 mt-2 p-6 border-2 border-slate-400/60 hover:border-brand border-dashed rounded-xl text-center transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <Upload className="mx-auto mb-2 w-8 h-8 text-slate-500" />
                    <p className="text-slate-700 text-sm">
                      {imageName || "Click or drag & drop an image"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="scene">Background</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={scene}
                    onValueChange={(v) => {
                      setScene(v);
                      setUseCustomHue(false);
                    }}
                  >
                    <SelectTrigger id="scene">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(scenes).map(([key, s]) => (
                        <SelectItem key={key} value={key}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={useCustomHue ? "secondary" : "link"}
                    onClick={() => setUseCustomHue((v) => !v)}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {useCustomHue && (
                <div>
                  <Label>Custom Hue: {customHue[0]}°</Label>
                  <Slider
                    value={customHue}
                    onValueChange={setCustomHue}
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label>Rim</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={rim}
                  onValueChange={(v) => v && setRim(v as Rim)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                  <ToggleGroupItem value="ring">Glossy Ring</ToggleGroupItem>
                  <ToggleGroupItem value="bubble">Iridescent</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div>
                <Label>Gloss Sheen: {gloss[0].toFixed(2)}</Label>
                <Slider
                  value={gloss}
                  onValueChange={setGloss}
                  max={1}
                  min={0}
                  step={0.05}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="size">Export Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger id="size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(sizePresets).map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}×{k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="aeroSoft"
                onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}
                className="w-full"
              >
                <Shuffle className="mr-2 w-4 h-4" />
                Shuffle Background
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="aero-glass">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <AeroBackground
                variant="preview"
                className="flex justify-center items-center p-8 rounded-xl min-h-[400px]"
              >
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    // checkerboard to convey PNG transparency
                    backgroundImage:
                      "linear-gradient(45deg,#cbd5e1 25%,transparent 25%),linear-gradient(-45deg,#cbd5e1 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cbd5e1 75%),linear-gradient(-45deg,transparent 75%,#cbd5e1 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                    backgroundColor: "#f1f5f9",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-[300px] max-w-full h-auto"
                    style={{ imageRendering: "auto" }}
                  />
                </div>
              </AeroBackground>
              <Button onClick={handleDownload} variant="aero" className="mt-4 w-full">
                <Download className="mr-2 w-4 h-4" />
                Download {S}×{S} PNG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AeroBackground>
  );
}
