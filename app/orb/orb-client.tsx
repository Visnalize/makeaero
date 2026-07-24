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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";

const huePresets: Record<string, number> = {
  blue: 245,
  green: 140,
  red: 15,
  purple: 280,
  orange: 35,
  pink: 320,
  teal: 180,
  yellow: 65,
  magenta: 300,
  cyan: 200,
};

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  s /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function OrbClient() {
  const [mode, setMode] = useState("css");
  const [orbStyle, setOrbStyle] = useState<"glossy" | "bubble">("glossy");
  const [orbSize, setOrbSize] = useState([200]);
  const [selectedHue, setSelectedHue] = useState("blue");
  const [customHue, setCustomHue] = useState([245]);
  const [saturation, setSaturation] = useState([0.15]);
  const [glossIntensity, setGlossIntensity] = useState([0.7]);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentHue = () => {
    return selectedHue === "custom"
      ? customHue[0]
      : huePresets[selectedHue];
  };

  const generateCSS = () => {
    const hue = getCurrentHue();
    const sat = saturation[0];
    const gloss = glossIntensity[0];
    const size = orbSize[0];

    if (orbStyle === "bubble") {
      return `/* Frutiger Aero Soap Bubble CSS */
.glossy-orb {
  --hue: ${hue};
  --sat: ${sat};
  --gloss: ${gloss};

  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  position: relative;

  /* Thin-film glass fill — mostly transparent, faintly tinted */
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, ${(0.5 + gloss * 0.4).toFixed(2)}), transparent 22%),
    radial-gradient(circle at 68% 74%, rgba(255, 255, 255, 0.12), transparent 35%),
    radial-gradient(
      circle at 50% 50%,
      oklch(95% var(--sat) var(--hue) / 0.12),
      oklch(85% var(--sat) var(--hue) / 0.04) 70%,
      transparent 100%
    );

  /* Rim-lit glass edge, no heavy depth shadow like a solid sphere */
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.5),
    inset -6px -6px 16px rgba(255, 255, 255, 0.18),
    inset 6px 10px 22px rgba(0, 0, 0, 0.06),
    0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Iridescent rainbow rim — the classic soap-bubble thin-film effect */
.glossy-orb::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 200deg,
    rgba(255, 150, 150, 0.55),
    rgba(255, 220, 140, 0.55),
    rgba(170, 255, 180, 0.55),
    rgba(140, 220, 255, 0.55),
    rgba(190, 150, 255, 0.55),
    rgba(255, 150, 220, 0.55),
    rgba(255, 150, 150, 0.55)
  );
  -webkit-mask-image: radial-gradient(circle, transparent 82%, black 87%, black 97%, transparent 100%);
  mask-image: radial-gradient(circle, transparent 82%, black 87%, black 97%, transparent 100%);
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Specular highlight */
.glossy-orb::after {
  content: "";
  position: absolute;
  top: 8%;
  left: 18%;
  width: 45%;
  height: 35%;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, ${Math.min(gloss + 0.2, 1).toFixed(2)}),
    transparent
  );
  border-radius: 50%;
  transform: rotate(-20deg);
  pointer-events: none;
}`;
    }

    return `/* Frutiger Aero Glossy Orb CSS */
.glossy-orb {
  --hue: ${hue};
  --sat: ${sat};
  --gloss: ${gloss};

  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  position: relative;

  /* Sphere gradient with OKLCH */
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, var(--gloss)),
    oklch(65% var(--sat) var(--hue)) 50%,
    oklch(35% var(--sat) var(--hue)) 100%
  );

  /* Depth shadows */
  box-shadow:
    inset 0 -4px 8px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.4);
}

/* Specular highlight */
.glossy-orb::after {
  content: "";
  position: absolute;
  top: 8%;
  left: 18%;
  width: 45%;
  height: 35%;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, ${Math.min(gloss + 0.1, 1).toFixed(2)}),
    transparent
  );
  border-radius: 50%;
  transform: rotate(-20deg);
  pointer-events: none;
}`;
  };

  const drawOrbToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = orbSize[0];
    const scale = 2;
    canvas.width = size * scale;
    canvas.height = size * scale;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const hue = getCurrentHue();
    const gloss = glossIntensity[0];

    // Map OKLCH-ish values to HSL for canvas
    const hslHue = hue;
    const hslSat = Math.round(saturation[0] * 300);
    const lightColor = hslToHex(hslHue, Math.min(hslSat, 100), 75);
    const midColor = hslToHex(hslHue, Math.min(hslSat, 100), 55);
    const darkColor = hslToHex(hslHue, Math.min(hslSat, 100), 30);

    if (orbStyle === "bubble") {
      // Canvas is left transparent (no opaque fill) so the exported PNG has
      // a real transparent background — authentic to soap-bubble renders.

      // Soft ground shadow
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.92, r * 0.55, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();

      // Faint tinted glass fill
      const fillGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
      fillGrad.addColorStop(0, `${lightColor}22`);
      fillGrad.addColorStop(0.7, `${midColor}11`);
      fillGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // User image, clipped small and faded so the glass reads as transparent
      if (uploadedImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
        ctx.clip();
        ctx.globalAlpha = 0.85;

        const imgAspect = uploadedImage.width / uploadedImage.height;
        const fitR = r * 1.1;
        let drawW: number, drawH: number;
        if (imgAspect > 1) {
          drawH = fitR;
          drawW = fitR * imgAspect;
        } else {
          drawW = fitR;
          drawH = fitR / imgAspect;
        }
        ctx.drawImage(uploadedImage, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // Iridescent rainbow rim — thin-film soap-bubble effect
      const segments = 180;
      const rimWidth = Math.max(2, r * 0.06);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < segments; i++) {
        const a0 = (i / segments) * Math.PI * 2;
        const a1 = ((i + 1) / segments) * Math.PI * 2;
        const rimHue = (i / segments) * 360;
        ctx.beginPath();
        ctx.arc(cx, cy, r - rimWidth / 2, a0, a1 + 0.02);
        ctx.strokeStyle = `hsla(${rimHue}, 90%, 75%, 0.5)`;
        ctx.lineWidth = rimWidth;
        ctx.stroke();
      }
      ctx.restore();

      // Big specular highlight
      ctx.save();
      ctx.translate(cx * 0.72, cy * 0.55);
      ctx.rotate((-20 * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.26, r * 0.19, 0, 0, Math.PI * 2);
      const bubbleSpecGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.26);
      bubbleSpecGrad.addColorStop(0, `rgba(255,255,255,${Math.min(gloss + 0.25, 1)})`);
      bubbleSpecGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bubbleSpecGrad;
      ctx.fill();
      ctx.restore();

      return;
    }

    // Shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = midColor;
    ctx.fill();
    ctx.restore();

    // Sphere gradient
    const grad = ctx.createRadialGradient(cx * 0.7, cy * 0.7, r * 0.05, cx, cy, r);
    grad.addColorStop(0, lightColor);
    grad.addColorStop(0.5, midColor);
    grad.addColorStop(1, darkColor);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner shadow at bottom
    const innerShadow = ctx.createRadialGradient(cx, cy + r * 0.3, r * 0.3, cx, cy, r);
    innerShadow.addColorStop(0, "rgba(0,0,0,0.3)");
    innerShadow.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = innerShadow;
    ctx.fill();

    // User image
    if (uploadedImage) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
      ctx.clip();

      const imgAspect = uploadedImage.width / uploadedImage.height;
      const fitR = r * 1.3;
      let drawW: number, drawH: number;
      if (imgAspect > 1) {
        drawH = fitR;
        drawW = fitR * imgAspect;
      } else {
        drawW = fitR;
        drawH = fitR / imgAspect;
      }
      ctx.drawImage(uploadedImage, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // Gloss overlay
    const glossGrad = ctx.createRadialGradient(cx * 0.7, cy * 0.6, r * 0.02, cx * 0.7, cy * 0.6, r * 0.65);
    glossGrad.addColorStop(0, `rgba(255,255,255,${gloss * 0.8})`);
    glossGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = glossGrad;
    ctx.fill();

    // Specular highlight
    ctx.save();
    ctx.translate(cx * 0.72, cy * 0.55);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.22, r * 0.16, 0, 0, Math.PI * 2);
    const specGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.22);
    specGrad.addColorStop(0, `rgba(255,255,255,${Math.min(gloss + 0.1, 1)})`);
    specGrad.addColorStop(1, "transparent");
    ctx.fillStyle = specGrad;
    ctx.fill();
    ctx.restore();
  }, [orbSize, orbStyle, selectedHue, customHue, saturation, glossIntensity, uploadedImage]);

  useEffect(() => {
    if (mode === "image") {
      drawOrbToCanvas();
    }
  }, [mode, drawOrbToCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const img = new Image();
    img.onload = () => setUploadedImage(img);
    img.src = URL.createObjectURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageName(file.name);
    const img = new Image();
    img.onload = () => setUploadedImage(img);
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = orbStyle === "bubble" ? "soap-bubble.png" : "glossy-orb.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const sharedControls = (
    <>
      <div>
        <Label htmlFor="orb-style">Style</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={orbStyle}
          onValueChange={(v) => v && setOrbStyle(v as "glossy" | "bubble")}
          className="justify-start"
        >
          <ToggleGroupItem value="glossy">Glossy Orb</ToggleGroupItem>
          <ToggleGroupItem value="bubble">Soap Bubble</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <Label>Orb Size: {orbSize[0]}px</Label>
        <Slider
          value={orbSize}
          onValueChange={setOrbSize}
          max={400}
          min={80}
          step={10}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex items-center gap-2">
          <Select value={selectedHue} onValueChange={setSelectedHue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(huePresets).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </SelectItem>
              ))}
              <SelectItem value="custom">(Custom)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={selectedHue === "custom" ? "secondary" : "link"}
            onClick={() =>
              setSelectedHue(selectedHue === "custom" ? "blue" : "custom")
            }
          >
            Custom
          </Button>
        </div>
      </div>

      {selectedHue === "custom" && (
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
          <div
            className="mt-2 border border-gray-300 rounded-lg h-8"
            style={{
              background: `linear-gradient(to right in oklch longer hue, oklch(75% 0.1 0), oklch(75% 0.1 360))`,
            }}
          />
        </div>
      )}

      <div>
        <Label>Color Saturation: {saturation[0].toFixed(2)}</Label>
        <Slider
          value={saturation}
          onValueChange={setSaturation}
          max={0.4}
          min={0.02}
          step={0.02}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Gloss Intensity: {glossIntensity[0].toFixed(2)}</Label>
        <Slider
          value={glossIntensity}
          onValueChange={setGlossIntensity}
          max={1.0}
          min={0.2}
          step={0.05}
          className="mt-2"
        />
      </div>
    </>
  );

  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-10 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="aero-title mb-3 font-bold text-4xl">
            Glossy Orb Generator
          </h1>
          <p className="aero-subtitle mx-auto mb-2 max-w-xl">
            Generate glossy Frutiger Aero-style orbs — as pure CSS or as a
            downloadable image with your own logo.
          </p>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="css">CSS Orb</TabsTrigger>
              <TabsTrigger value="image">Image Orb</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="css">
            <div className="gap-8 grid lg:grid-cols-2">
              <Card className="aero-glass">
                <CardHeader>
                  <CardTitle>Orb Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sharedControls}
                </CardContent>
              </Card>

              <Card className="aero-glass">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <AeroBackground
                    variant="preview"
                    className="relative flex justify-center items-center p-8 rounded-xl min-h-[400px]"
                  >
                    <style>{generateCSS()}</style>
                    <div className="glossy-orb" />
                  </AeroBackground>
                </CardContent>
              </Card>
            </div>

            <div className="my-8">
              <CodeOutput
                code={generateCSS()}
                language="css"
                copyButtons={[
                  { label: "Copy CSS", text: generateCSS() },
                  {
                    label: "Copy HTML",
                    text: `<div class="glossy-orb"></div>`,
                    variant: "outline",
                  },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="image">
            <div className="gap-8 grid lg:grid-cols-2">
              <Card className="aero-glass">
                <CardHeader>
                  <CardTitle>Orb Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Logo / Image</Label>
                    <div
                      className="hover:bg-blue-50/50 mt-2 p-6 border-2 border-slate-300 hover:border-blue-400 border-dashed rounded-xl text-center transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <Upload className="mx-auto mb-2 w-8 h-8 text-slate-500" />
                      {imageName ? (
                        <p className="text-slate-700 text-sm">{imageName}</p>
                      ) : (
                        <p className="text-slate-600 text-sm">
                          Click or drag & drop an image
                        </p>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                    {uploadedImage && (
                      <Button
                        variant="link"
                        className="mt-1 p-0 h-auto text-xs"
                        onClick={() => {
                          setUploadedImage(null);
                          setImageName("");
                        }}
                      >
                        Remove image
                      </Button>
                    )}
                  </div>
                  {sharedControls}
                </CardContent>
              </Card>

              <Card className="aero-glass">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <AeroBackground
                    variant="preview"
                    className="relative flex flex-col justify-center items-center gap-6 p-8 rounded-xl min-h-[400px]"
                  >
                    <canvas ref={canvasRef} />
                    <Button onClick={handleDownload} variant="aero">
                      <Download className="mr-2 w-4 h-4" />
                      Download PNG
                    </Button>
                  </AeroBackground>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AeroBackground>
  );
}
