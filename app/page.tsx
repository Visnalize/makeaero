"use client";

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
import type React from "react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

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
  const initialHue = "green";
  const [buttonText, setButtonText] = useState("Accept");
  const [buttonSize, setButtonSize] = useState("large");
  const [selectedHue, setSelectedHue] = useState(initialHue);
  const [customHue, setCustomHue] = useState([140]);
  const [glowIntensity, setGlowIntensity] = useState([0.7]);
  const [saturation, setSaturation] = useState([0.2]);
  const [codeHtml, setCodeHtml] = useState("");

  const getCurrentHue = () => {
    return selectedHue === "custom"
      ? customHue[0]
      : huePresets[selectedHue as keyof typeof huePresets];
  };

  const generateCSS = () => {
    const hue = getCurrentHue();
    const sat = saturation[0];
    const glow = glowIntensity[0];

    return `/* Authentic Frutiger Aero Button CSS */
.frutiger-aero-button {
  /* OKLCH Color System for accurate colors */
  --hue: ${hue};
  --sat: ${sat};
  --glow-intensity: ${glow};
  
  /* Color Variables */
  --fg: oklch(15% calc(var(--sat) * 0.5) var(--hue));
  --bg: oklch(75% var(--sat) var(--hue) / 0.8);
  --bg-dark: oklch(45% var(--sat) var(--hue) / 0.75);
  --bottom-glow: radial-gradient(
    farthest-corner at bottom center,
    rgba(255, 255, 255, var(--glow-intensity)),
    transparent
  );
  
  /* Base Styling */
  background-color: var(--bg);
  background: 
    var(--bottom-glow),
    linear-gradient(to bottom, var(--bg-dark), var(--bg));
  
  border: 1px solid var(--bg);
  border-radius: 9999px;
  
  /* Shadows and Effects */
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  
  /* Typography */
  color: var(--fg);
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Segoe UI", system-ui, sans-serif;
  font-weight: 700;
  text-shadow: 0 2px 0.5em rgba(0, 0, 0, 0.2);
  
  /* Layout */
  cursor: pointer;
  position: relative;
  transition: all 300ms ease;
  
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
  padding: 0.5em 1.5em;
  font-size: 0.875rem;
}

.frutiger-aero-button.medium {
  padding: 0.75em 2em;
  font-size: 1rem;
}

.frutiger-aero-button.large {
  padding: 1em 3em;
  font-size: 1.125rem;
}`;
  };

  const glow = glowIntensity[0];

  useEffect(() => {
    codeToHtml(generateCSS(), {
      lang: "css",
      theme: "dracula",
    }).then(setCodeHtml);
  }, [selectedHue, customHue, saturation, glowIntensity]);

  return (
    <div
      className="min-h-screen px-6 py-10 flex flex-col"
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
          <h1 className="text-4xl font-bold text-black mb-3">
            Frutiger Aero Button Generator
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto mb-2">
            Create authentic Frutiger Aero-style buttons with customizable
            sizes, colors, and effects using the OKLCH color system.
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
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={buttonSize}
                  onValueChange={setButtonSize}
                  className="justify-start"
                >
                  <ToggleGroupItem value="small">Small</ToggleGroupItem>
                  <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                  <ToggleGroupItem value="large">Large</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div>
                <Label htmlFor="hue">Color</Label>
                <div className="flex items-center gap-2">
                  <Select value={selectedHue} onValueChange={setSelectedHue}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="teal">Teal</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="magenta">Magenta</SelectItem>
                      <SelectItem value="cyan">Cyan</SelectItem>
                      <SelectItem value="custom">(Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={selectedHue === "custom" ? "secondary" : "link"}
                    onClick={() =>
                      setSelectedHue(
                        selectedHue === "custom" ? initialHue : "custom"
                      )
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
                  max={0.6}
                  min={0.02}
                  step={0.02}
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
                <style>{generateCSS()}</style>
                <button className={`frutiger-aero-button ${buttonSize}`}>
                  {buttonText}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSS Output */}
        <Card className="my-8 backdrop-blur-sm bg-white/90 border-white/30">
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

        <p className="text-slate-600 text-center">
          A fun little project by{" "}
          <a
            href="https://visnalize.com"
            target="_blank"
            className="text-blue-600"
          >
            Visnalize
          </a>
        </p>
      </div>
    </div>
  );
}
