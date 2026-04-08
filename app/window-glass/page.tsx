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
  const [glassOpacity, setGlassOpacity] = useState([0.6]);
  const [borderRadius, setBorderRadius] = useState([6]);
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
/* Based on 7.css — https://github.com/khang-nd/7.css */

.aero-window {
  font-family: "Segoe UI", "SegoeUI", "Noto Sans", sans-serif;
  font-size: 9pt;
  width: ${width}px;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: ${radius}px;
  box-shadow:
    2px 2px 10px 1px rgba(0, 0, 0, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.98);
  position: relative;
  z-index: 0;
}

/* Full-window colored glass layer */
.aero-window::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${radius}px;
  background:
    linear-gradient(transparent 20%, rgba(255, 255, 255, 0.7) 40%, transparent 41%),
    linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.2)),
    hsl(${hue}, 55%, 45%);
  background-color: hsl(${hue}, 55%, 45%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.99);
  opacity: ${opacity};
}

/* Blur backdrop */
.aero-window::after {
  content: "";
  position: absolute;
  z-index: -10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${radius}px;
  backdrop-filter: blur(4px);
}

/* Title bar — authentic diagonal glass stripe texture */
.aero-title-bar {
  padding: 6px;
  padding-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${radius}px ${radius}px 0 0;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.99),
    inset 1px 0 0 rgba(255, 255, 255, 0.99),
    inset -1px 0 0 rgba(255, 255, 255, 0.99);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.33) 70px, transparent 100px),
    linear-gradient(225deg, rgba(255, 255, 255, 0.33) 70px, transparent 100px),
    linear-gradient(
      54deg,
      rgba(0,0,0,0.13) 0 4%, rgba(102,102,102,0.07) 6%, rgba(0,0,0,0.13) 8% 10%,
      rgba(0,0,0,0.13) 15% 16%, rgba(170,170,170,0.07) 17% 18%, rgba(0,0,0,0.13) 23% 24%,
      rgba(187,187,187,0.13) 25% 26%, rgba(0,0,0,0.13) 31% 33%,
      rgba(0,0,0,0.13) 34% 34.5%, rgba(187,187,187,0.13) 36% 40%,
      rgba(0,0,0,0.13) 41% 41.5%, rgba(187,187,187,0.13) 44% 45%,
      rgba(187,187,187,0.13) 46% 47%, rgba(0,0,0,0.13) 48% 49%, rgba(0,0,0,0.13) 50% 50.5%,
      rgba(0,0,0,0.13) 56% 56.5%, rgba(187,187,187,0.13) 57% 63%, rgba(0,0,0,0.13) 67% 69%,
      rgba(187,187,187,0.13) 69.5% 70%, rgba(0,0,0,0.13) 73.5% 74%,
      rgba(187,187,187,0.13) 74.5% 79%, rgba(0,0,0,0.13) 80% 84%,
      rgba(170,170,170,0.13) 85% 86%, rgba(0,0,0,0.13) 87%, rgba(187,187,187,0.07) 90%
    ) left center / 100vw 100vh no-repeat fixed;
}

/* Title icon */
.aero-title-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  padding-top: 6px;
  flex-shrink: 0;
  display: block;
}

/* Title text — black with white glow for glass legibility */
.aero-title-bar-text {
  color: #000000;
  letter-spacing: 0;
  line-height: 15px;
  padding-top: 6px;
  text-shadow:
    0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff,
    0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Window controls strip — capsule hanging from top */
.aero-title-bar-controls {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-top: 0;
  border-radius: 0 0 5px 5px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.98),
    1px 0 0 rgba(255, 255, 255, 0.98),
    -1px 0 0 rgba(255, 255, 255, 0.98);
}

.aero-title-bar-controls button {
  position: relative;
  min-width: 29px;
  min-height: 21px;
  padding: 0;
  border: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.65);
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.9), 0 1px 0 rgba(255, 255, 255, 0.8);
  background: linear-gradient(
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.3) 45%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    rgba(255, 255, 255, 0.5)
  );
  transition: box-shadow 0.1s;
}

.aero-title-bar-controls button:first-child {
  border-bottom-left-radius: 5px;
}

.aero-title-bar-controls button:last-child {
  border-right: 0;
  border-bottom-right-radius: 5px;
  min-width: 48px;
}

/* Hover — cyan radial glow */
.aero-title-bar-controls button:not(.close):hover {
  background:
    radial-gradient(circle at bottom, #2aceda, transparent 65%),
    linear-gradient(#b6d9ee 50%, #1a6ca1 50%);
  box-shadow: 0 0 7px 3px #5dc4f0, inset 0 0 0 1px rgba(255, 255, 255, 0.98);
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
}

.aero-title-bar-controls button:not(.close):active {
  background:
    radial-gradient(circle at bottom, #0bfdfa, transparent 65%),
    linear-gradient(#86a7bc 50%, #092747 50%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.98);
}

/* Close button */
.aero-title-bar-controls button.close {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  background:
    radial-gradient(circle at -60% 50%, rgba(0, 0, 0, 0.44) 5% 10%, transparent 50%),
    radial-gradient(circle at 160% 50%, rgba(0, 0, 0, 0.44) 5% 10%, transparent 50%),
    linear-gradient(rgba(224, 161, 151, 0.9), #cf796a 25% 50%, #d54f36 50%);
}

.aero-title-bar-controls button.close:hover {
  background:
    radial-gradient(circle at bottom, #ff8a7a, transparent 65%),
    linear-gradient(#ffbdb3 50%, #d40000 50%);
  box-shadow: 0 0 7px 3px #ff5030, inset 0 0 0 1px rgba(255, 255, 255, 0.98);
  color: white;
}

.aero-title-bar-controls button.close:active {
  background:
    radial-gradient(circle at bottom, #ff3300, transparent 65%),
    linear-gradient(#d45050 50%, #8b0000 50%);
}${showMenuBar ? `

/* Menu bar */
.aero-window-menubar {
  background: linear-gradient(#fff 20%, #f1f4fa 25%, #f1f4fa 43%, #d4dbee 48%, #e6eaf6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: stretch;
  font-size: 9pt;
  color: #000;
  font-family: "Segoe UI", "SegoeUI", "Noto Sans", sans-serif;
}

.aero-window-menubar span {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  cursor: default;
}

.aero-window-menubar span:hover {
  background: #3399ff;
  color: #fff;
}` : ""}

/* Window body — solid #f0f0f0 surface, inset 6px from glass border */
.aero-window-body {
  margin: 6px;
  margin-top: 0;
  border: 1px solid rgba(0, 0, 0, 0.7);
  background: #f0f0f0;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);
  padding: 6px;
}`;  }

  const generateHTML = () => {
    return `<div class="aero-window">
  <div class="aero-title-bar">
    <span class="aero-title-icon"></span>
    <span class="aero-title-bar-text">${windowTitle}</span>
    <div class="aero-title-bar-controls">
      <button aria-label="Minimize">&#8212;</button>
      <button aria-label="Maximize">&#9633;</button>
      <button aria-label="Close" class="close">&#215;</button>
    </div>
  </div>${showMenuBar ? `
  <div class="aero-window-menubar">
    <span>File</span>
    <span>Edit</span>
    <span>Format</span>
    <span>View</span>
    <span>Help</span>
  </div>` : ""}
  <div class="aero-window-body">
    <!-- Your content here -->
  </div>
</div>`;  }

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
                  <div className="aero-title-bar">
                    <span className="aero-title-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect width="16" height="16" rx="2" fill="#4a90d9"/>
                        <rect x="3" y="4" width="10" height="1.5" rx="0.5" fill="white"/>
                        <rect x="3" y="7" width="10" height="1.5" rx="0.5" fill="white"/>
                        <rect x="3" y="10" width="7" height="1.5" rx="0.5" fill="white"/>
                      </svg>
                    </span>
                    <span className="aero-title-bar-text">{windowTitle}</span>
                    <div className="aero-title-bar-controls">
                      <button aria-label="Minimize">&#8212;</button>
                      <button aria-label="Maximize">&#9633;</button>
                      <button aria-label="Close" className="close">&#215;</button>
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
                    className="aero-window-body"
                    style={{ minHeight: windowHeight[0] - (showMenuBar ? 50 : 27) }}
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
