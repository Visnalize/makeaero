"use client";

import { AeroBackground } from "@/components/aero-background";
import { CodeOutput } from "@/components/code-output";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";

const huePresets: Record<string, number> = {
  blue: 210,
  "dark blue": 230,
  purple: 270,
  teal: 180,
  green: 140,
  graphite: 220,
};

export default function WindowGlassGeneratorPage() {
  const [windowTitle, setWindowTitle] = useState("Untitled - Notepad");
  const [windowWidth, setWindowWidth] = useState([500]);
  const [windowHeight, setWindowHeight] = useState([350]);
  const [selectedHue, setSelectedHue] = useState("blue");
  const [customHue, setCustomHue] = useState([210]);
  const [glassOpacity, setGlassOpacity] = useState([0.65]);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [showMenuBar, setShowMenuBar] = useState(true);

  const getCurrentHue = () => {
    return selectedHue === "custom"
      ? customHue[0]
      : huePresets[selectedHue];
  };

  const generateCSS = () => {
    const hue = getCurrentHue();
    const opacity = glassOpacity[0];
    const radius = borderRadius[0];
    const width = windowWidth[0];

    return `/* Windows 7 Aero Glass Window CSS */
.aero-window {
  --glass-hue: ${hue};
  --glass-opacity: ${opacity};

  width: ${width}px;
  border-radius: ${radius}px;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, sans-serif;
  position: relative;

  /* Glass border and glow */
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.35),
    0 0 20px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* Title bar */
.aero-window-titlebar {
  height: 30px;
  background: linear-gradient(
    to bottom,
    oklch(50% 0.06 var(--glass-hue) / var(--glass-opacity)),
    oklch(30% 0.08 var(--glass-hue) / calc(var(--glass-opacity) + 0.15))
  );
  display: flex;
  align-items: center;
  padding: 0 8px;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

/* Title bar glass highlight */
.aero-window-titlebar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.05)
  );
  pointer-events: none;
}

/* Window icon placeholder */
.aero-window-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

/* Title text */
.aero-window-title {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 12px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

/* Window controls (min, max, close) */
.aero-window-controls {
  display: flex;
  gap: 2px;
  position: relative;
  z-index: 1;
}

.aero-window-controls button {
  width: 28px;
  height: 20px;
  border: none;
  border-radius: 2px;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.1);
  transition: background 150ms;
}

.aero-window-controls button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.aero-window-controls button.close {
  background: rgba(200, 50, 50, 0.5);
}

.aero-window-controls button.close:hover {
  background: rgba(220, 60, 60, 0.8);
}${showMenuBar ? `

/* Menu bar */
.aero-window-menubar {
  height: 24px;
  background: linear-gradient(
    to bottom,
    oklch(92% 0.01 var(--glass-hue)),
    oklch(88% 0.01 var(--glass-hue))
  );
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #333;
}

.aero-window-menubar span {
  padding: 2px 6px;
  border-radius: 2px;
  cursor: default;
}

.aero-window-menubar span:hover {
  background: oklch(82% 0.04 var(--glass-hue));
}` : ""}

/* Content area */
.aero-window-content {
  background: white;
  min-height: 200px;
  padding: 8px;
}`;
  };

  const generateHTML = () => {
    return `<div class="aero-window">
  <div class="aero-window-titlebar">
    <div class="aero-window-icon"></div>
    <span class="aero-window-title">${windowTitle}</span>
    <div class="aero-window-controls">
      <button>&#8212;</button>
      <button>&#9633;</button>
      <button class="close">&#10005;</button>
    </div>
  </div>${showMenuBar ? `
  <div class="aero-window-menubar">
    <span>File</span>
    <span>Edit</span>
    <span>Format</span>
    <span>View</span>
    <span>Help</span>
  </div>` : ""}
  <div class="aero-window-content">
    <!-- Your content here -->
  </div>
</div>`;
  };

  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-10 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 font-bold text-black text-4xl">
            Window Glass Generator
          </h1>
          <p className="mx-auto mb-2 max-w-xl text-slate-600">
            Generate authentic Windows 7 Aero-style glass window frames with
            customizable title bars, glass effects, and content areas.
          </p>
        </div>

        <div className="gap-8 grid lg:grid-cols-2">
          {/* Controls */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/30">
            <CardHeader>
              <CardTitle>Window Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Window Title</Label>
                <Input
                  id="title"
                  value={windowTitle}
                  onChange={(e) => setWindowTitle(e.target.value)}
                  placeholder="Enter window title"
                />
              </div>

              <div>
                <Label>Width: {windowWidth[0]}px</Label>
                <Slider
                  value={windowWidth}
                  onValueChange={setWindowWidth}
                  max={800}
                  min={300}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Height: {windowHeight[0]}px</Label>
                <Slider
                  value={windowHeight}
                  onValueChange={setWindowHeight}
                  max={600}
                  min={150}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Glass Color</Label>
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
                      setSelectedHue(
                        selectedHue === "custom" ? "blue" : "custom"
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
                    className="mt-2 border border-gray-300 rounded-lg h-8"
                    style={{
                      background: `linear-gradient(to right in oklch longer hue, oklch(50% 0.08 0), oklch(50% 0.08 360))`,
                    }}
                  />
                </div>
              )}

              <div>
                <Label>Glass Opacity: {glassOpacity[0].toFixed(2)}</Label>
                <Slider
                  value={glassOpacity}
                  onValueChange={setGlassOpacity}
                  max={0.9}
                  min={0.3}
                  step={0.05}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Border Radius: {borderRadius[0]}px</Label>
                <Slider
                  value={borderRadius}
                  onValueChange={setBorderRadius}
                  max={16}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="menubar"
                  checked={showMenuBar}
                  onChange={(e) => setShowMenuBar(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="menubar" className="cursor-pointer">
                  Show Menu Bar
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/30">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <AeroBackground
                variant="preview"
                className="relative flex justify-center items-center p-8 rounded-xl min-h-[400px] overflow-auto"
              >
                <style>{generateCSS()}</style>
                <div className="aero-window" style={{ width: windowWidth[0] }}>
                  <div className="aero-window-titlebar">
                    <div className="aero-window-icon" />
                    <span className="aero-window-title">{windowTitle}</span>
                    <div className="aero-window-controls">
                      <button>&#8212;</button>
                      <button>&#9633;</button>
                      <button className="close">&#10005;</button>
                    </div>
                  </div>
                  {showMenuBar && (
                    <div className="aero-window-menubar">
                      <span>File</span>
                      <span>Edit</span>
                      <span>Format</span>
                      <span>View</span>
                      <span>Help</span>
                    </div>
                  )}
                  <div
                    className="aero-window-content"
                    style={{ minHeight: windowHeight[0] - (showMenuBar ? 54 : 30) }}
                  />
                </div>
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
              { label: "Copy HTML", text: generateHTML(), variant: "outline" },
            ]}
          />
        </div>
      </div>
    </AeroBackground>
  );
}
