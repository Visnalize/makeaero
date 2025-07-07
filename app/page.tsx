"use client";

import { codeToHtml } from "shiki";
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
import type React from "react";
import { useEffect, useState } from "react";

const huePresets = {
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

export default function App() {
  const [buttonText, setButtonText] = useState("Accept");
  const [buttonSize, setButtonSize] = useState("large");
  const [selectedHue, setSelectedHue] = useState("green");
  const [customHue, setCustomHue] = useState([140]);
  const [glowIntensity, setGlowIntensity] = useState([0.7]);
  const [saturation, setSaturation] = useState([0.1]);
  const [codeHtml, setCodeHtml] = useState("");

  const getCurrentHue = () => {
    return selectedHue === "custom"
      ? customHue[0]
      : huePresets[selectedHue as keyof typeof huePresets];
  };

  const getSizeClasses = () => {
    switch (buttonSize) {
      case "small":
        return "px-4 py-2 text-sm min-w-[80px]";
      case "large":
        return "px-8 py-4 text-lg min-w-[160px]";
      default:
        return "px-6 py-3 text-base min-w-[120px]";
    }
  };

  const generateCSS = () => {
    const hue = getCurrentHue();
    const sat = saturation[0];
    const glow = glowIntensity[0];

    return `/* Authentic Frutiger Aero Button CSS */
.frutiger-aero-button {
  /* OKLCH Color System for accurate colors */
  --hue: ${hue};
  --saturation: ${sat};
  --glow-intensity: ${glow};
  
  /* Color Variables */
  --button-background: oklch(75% var(--saturation) var(--hue) / 0.8);
  --bg-dark: oklch(45% var(--saturation) var(--hue) / 0.75);
  --button-foreground: oklch(15% calc(var(--saturation) * 0.5) var(--hue));
  --bottom-glow: radial-gradient(
    farthest-corner at bottom center,
    rgba(255, 255, 255, var(--glow-intensity)),
    transparent
  );
  
  /* Base Styling */
  background-color: var(--button-background);
  background: 
    var(--bottom-glow),
    linear-gradient(to bottom, var(--bg-dark), var(--button-background));
  
  border: 1px solid var(--button-background);
  border-radius: 9999px;
  
  /* Shadows and Effects */
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  
  /* Typography */
  color: var(--button-foreground);
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Segoe UI", system-ui, sans-serif;
  font-weight: 700;
  text-shadow: 0 2px 0.5em rgba(0, 0, 0, 0.2);
  
  /* Layout */
  cursor: pointer;
  position: relative;
  transition: all 300ms ease;
  min-width: 160px;
  
  /* Prevent text selection */
  user-select: none;
  -webkit-user-select: none;
}

/* Top Highlight Effect */
.frutiger-aero-button::after {
  content: "";
  position: absolute;
  top: 4%;
  left: 0.75em;
  width: calc(100% - 1.5em);
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: inherit;
  transition: background 400ms ease;
  pointer-events: none;
}

/* Hover State */
.frutiger-aero-button:hover,
.frutiger-aero-button:focus {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

/* Active State */
.frutiger-aero-button:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transform: translateY(1px);
}

/* Size Variations */
.frutiger-aero-button.small {
  padding: 0.5em 0.75em;
  font-size: 0.875rem;
}

.frutiger-aero-button.medium {
  padding: 0.75em 1em;
  font-size: 1rem;
}

.frutiger-aero-button.large {
  padding: 1em 1.5em;
  font-size: 1.125rem;
}`;
  };

  const hue = getCurrentHue();
  const sat = saturation[0];
  const glow = glowIntensity[0];

  useEffect(() => {
    codeToHtml(generateCSS(), {
      lang: "css",
      theme: "dracula",
    }).then((html) => {
      setCodeHtml(html);
    });
  }, [selectedHue, customHue, saturation, glowIntensity]);

  return (
    <div
      className="min-h-screen p-8 flex flex-col"
      style={{
        background: `
          repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 20px
          ),
          linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)
        `,
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Frutiger Aero Button Generator
          </h1>
          <p className="text-slate-600">
            Create authentic Frutiger Aero-style buttons with customizable
            colors, shapes, and effects using the OKLCH color system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card className="backdrop-blur-sm bg-white/90 border-white/30">
            <CardHeader>
              <CardTitle>Button Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="text">Button Text</Label>
                <Input
                  id="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Enter button text"
                />
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Select value={buttonSize} onValueChange={setButtonSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hue">Color Hue</Label>
                <Select value={selectedHue} onValueChange={setSelectedHue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue (245°)</SelectItem>
                    <SelectItem value="green">Green (140°)</SelectItem>
                    <SelectItem value="red">Red (15°)</SelectItem>
                    <SelectItem value="purple">Purple (280°)</SelectItem>
                    <SelectItem value="orange">Orange (35°)</SelectItem>
                    <SelectItem value="pink">Pink (320°)</SelectItem>
                    <SelectItem value="teal">Teal (180°)</SelectItem>
                    <SelectItem value="yellow">Yellow (65°)</SelectItem>
                    <SelectItem value="magenta">Magenta (300°)</SelectItem>
                    <SelectItem value="cyan">Cyan (200°)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
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
                    className="h-8 rounded-lg mt-2 border border-gray-300"
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
                  max={0.2}
                  min={0.05}
                  step={0.01}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Bottom Glow Intensity: {glow.toFixed(2)}</Label>
                <Slider
                  value={glowIntensity}
                  onValueChange={setGlowIntensity}
                  max={1.0}
                  min={0.3}
                  step={0.05}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="backdrop-blur-sm bg-white/90 border-white/30">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-xl p-16 flex items-center justify-center min-h-[400px] relative"
                style={{
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      rgba(255, 255, 255, 0.1),
                      rgba(255, 255, 255, 0.1) 1px,
                      transparent 1px,
                      transparent 15px
                    ),
                    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
                  `,
                }}
              >
                <button
                  className={`
                    relative cursor-pointer transition-all duration-300 ease-out
                    ${getSizeClasses()}
                    rounded-full flex items-center justify-center gap-2
                    font-bold select-none
                    hover:transform hover:-translate-y-0.5
                    active:transform active:translate-y-0.5
                  `}
                  style={
                    {
                      // OKLCH Color Variables
                      "--hue": hue,
                      "--saturation": sat,
                      "--glow-intensity": glow,
                      "--button-background": `oklch(75% ${sat} ${hue} / 0.8)`,
                      "--bg-dark": `oklch(45% ${sat} ${hue} / 0.75)`,
                      "--button-foreground": `oklch(15% ${sat * 0.5} ${hue})`,
                      "--bottom-glow": `radial-gradient(farthest-corner at bottom center, rgba(255, 255, 255, ${glow}), transparent)`,

                      // Applied Styles
                      backgroundColor: `oklch(75% ${sat} ${hue} / 0.8)`,
                      background: `
                      radial-gradient(farthest-corner at bottom center, rgba(255, 255, 255, ${glow}), transparent),
                      linear-gradient(to bottom, oklch(45% ${sat} ${hue} / 0.75), oklch(75% ${sat} ${hue} / 0.8))
                    `,
                      border: `1px solid oklch(75% ${sat} ${hue} / 0.8)`,
                      boxShadow: "0 4px 4px rgba(0, 0, 0, 0.4)",
                      color: `oklch(15% ${sat * 0.5} ${hue})`,
                      fontFamily:
                        '"Lucida Grande", "Lucida Sans Unicode", "Segoe UI", system-ui, sans-serif',
                      textShadow: "0 2px 0.5em rgba(0, 0, 0, 0.2)",
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 4px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0, 0, 0, 0.4)";
                  }}
                >
                  {/* Top Highlight */}
                  <div
                    className="absolute pointer-events-none transition-all duration-400"
                    style={{
                      top: "4%",
                      left: "0.75em",
                      width: "calc(100% - 1.5em)",
                      height: "40%",
                      background:
                        "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1))",
                      borderRadius: "inherit",
                    }}
                  />

                  <span className="relative z-10">{buttonText}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSS Output */}
        <Card className="mt-8 backdrop-blur-sm bg-white/90 border-white/30">
          <CardHeader>
            <CardTitle>Generated CSS Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => navigator.clipboard.writeText(generateCSS())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Copy CSS
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const htmlCode = `<button class="frutiger-aero-button ${buttonSize}">${buttonText}</button>`;
                  navigator.clipboard.writeText(htmlCode);
                }}
              >
                Copy HTML
              </Button>
            </div>
            {codeHtml ? (
              <div dangerouslySetInnerHTML={{ __html: codeHtml }}></div>
            ) : (
              <pre className="bg-[#282A36] text-[#F8F8F2]">{generateCSS()}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
