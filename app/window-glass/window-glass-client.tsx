"use client";

import { AeroBackground } from "@/components/aero-background";
import { CodeOutput } from "@/components/code-output";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  "dark blue": 225,
  purple: 270,
  teal: 185,
  green: 140,
  graphite: 220,
};

// The document icon shipped inline in the copied HTML so the window has no
// external asset dependency.
const TITLE_ICON = `<svg class="aero-titlebar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="1" width="14" height="14" rx="2" fill="#4a90d9"/><rect x="4" y="4" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="4" y="7" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="4" y="10" width="5" height="1.5" rx="0.75" fill="#fff"/></svg>`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TITLE_H = 30;
const MENU_H = 29;
const STATUS_H = 24;

export default function WindowGlassClient() {
  const [windowTitle, setWindowTitle] = useState("Untitled - Notepad");
  const [windowWidth, setWindowWidth] = useState([520]);
  const [windowHeight, setWindowHeight] = useState([360]);
  const [selectedHue, setSelectedHue] = useState("blue");
  const [customHue, setCustomHue] = useState([210]);
  const [glassOpacity, setGlassOpacity] = useState([0.6]);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [active, setActive] = useState(true);
  const [content, setContent] = useState(
    "This Aero window is pure CSS — no images, no libraries.\nCopy the CSS and HTML and drop it anywhere."
  );

  const getCurrentHue = () =>
    selectedHue === "custom" ? customHue[0] : huePresets[selectedHue];

  const bodyMinHeight = Math.max(
    60,
    windowHeight[0] -
      TITLE_H -
      (showMenuBar ? MENU_H : 0) -
      (showStatusBar ? STATUS_H : 0) -
      12
  );

  const generateCSS = () => {
    const hue = getCurrentHue();
    const opacity = glassOpacity[0];
    const radius = borderRadius[0];
    const width = windowWidth[0];

    return `/* ---------------------------------------------------------------
   Aero Glass Window — self-contained, zero dependencies.
   Just copy this CSS and the matching HTML; it works on any
   background. Tweak the custom properties on .aero-window to taste.
   --------------------------------------------------------------- */

.aero-window {
  --hue: ${hue};
  --radius: ${radius}px;
  --glass-opacity: ${opacity};
  /* Alpha is baked into the tint so the colour stays vivid while the gloss
     highlights (layered on top) render at full strength. */
  --glass: hsl(var(--hue) 65% 52% / var(--glass-opacity));
  --frame: 9px;

  position: relative;
  isolation: isolate;
  width: ${width}px;
  border-radius: var(--radius);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, system-ui, sans-serif;
  font-size: 12px;
  color: #1b1b1b;
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.5),
    0 0 26px hsl(var(--hue) 90% 58% / 0.28),
    0 0 0 1px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.95),
    inset 0 0 30px rgba(255, 255, 255, 0.28);
}

/* Colored glass sheet — vivid tint + specular gloss + diagonal sheen */
.aero-window::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: var(--radius);
  background:
    /* diagonal reflection streak */
    linear-gradient(104deg, transparent 26%, rgba(255, 255, 255, 0.32) 42%, rgba(255, 255, 255, 0.05) 50%, transparent 64%),
    /* bright top specular highlight */
    linear-gradient(to bottom, rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.2) 42%, rgba(255, 255, 255, 0) 54%),
    /* soft vertical shade for depth */
    linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.12)),
    /* colored glass tint */
    var(--glass);
}

/* Frost whatever sits behind the window — the effect that makes it glass */
.aero-window::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  border-radius: var(--radius);
  -webkit-backdrop-filter: blur(18px) saturate(1.9);
  backdrop-filter: blur(18px) saturate(1.9);
}

/* ---- Title bar ---- */
.aero-window .aero-titlebar {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 0 6px;
  min-height: ${TITLE_H}px;
  border-radius: var(--radius) var(--radius) 0 0;
  /* faint self-contained brushed sheen */
  background: repeating-linear-gradient(
    108deg,
    rgba(255, 255, 255, 0.05) 0 1px,
    transparent 1px 5px
  );
}

.aero-window .aero-titlebar-icon {
  width: 16px;
  height: 16px;
  margin-top: 7px;
  flex: none;
}

.aero-window .aero-titlebar-text {
  flex: 1;
  min-width: 0;
  margin-top: 7px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #0b0b0b;
  /* white halo keeps the caption legible over any glass color */
  text-shadow: 0 0 4px #fff, 0 0 4px #fff, 0 0 7px #fff, 0 0 10px #fff;
}

/* ---- Caption buttons (capsule hanging from the top edge) ---- */
.aero-window .aero-caption {
  display: flex;
  flex: none;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-top: 0;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9),
    1px 0 0 rgba(255, 255, 255, 0.7),
    -1px 0 0 rgba(255, 255, 255, 0.7);
}

.aero-window .aero-caption button {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 29px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.28);
  color: rgba(0, 0, 0, 0.68);
  cursor: pointer;
  background: linear-gradient(
    rgba(255, 255, 255, 0.55),
    rgba(255, 255, 255, 0.28) 46%,
    rgba(0, 0, 0, 0.08) 50%,
    rgba(0, 0, 0, 0.08) 78%,
    rgba(255, 255, 255, 0.4)
  );
  transition: box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease;
}

.aero-window .aero-caption button:last-child {
  border-right: 0;
  min-width: 46px;
}

/* Glyphs drawn in pure CSS — no icon font, no images */
.aero-window .aero-caption .min::before {
  content: "";
  width: 10px;
  height: 2px;
  margin-top: 6px;
  background: currentColor;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}
.aero-window .aero-caption .max::before {
  content: "";
  width: 11px;
  height: 9px;
  border: 1px solid currentColor;
  border-top-width: 2px;
}
.aero-window .aero-caption .close::before {
  content: "\\2715";
  font-size: 11px;
  line-height: 1;
}

/* Hover / active — cyan Aero glow for min & max */
.aero-window .aero-caption button:not(.close):hover {
  color: #fff;
  background:
    radial-gradient(120% 90% at 50% 130%, #3fd0e6, transparent 60%),
    linear-gradient(#c3e3f4 48%, #1f79b0 50%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9), 0 0 8px 2px rgba(93, 196, 240, 0.85);
}
.aero-window .aero-caption button:not(.close):active {
  background:
    radial-gradient(120% 90% at 50% 130%, #12e6e6, transparent 60%),
    linear-gradient(#8fb3c9 48%, #0d3350 50%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

/* Close button — red */
.aero-window .aero-caption .close {
  color: #fff;
  background:
    radial-gradient(circle at -30% 50%, rgba(0, 0, 0, 0.4) 6%, transparent 55%),
    radial-gradient(circle at 130% 50%, rgba(0, 0, 0, 0.4) 6%, transparent 55%),
    linear-gradient(#e6a99f, #d16b5b 48%, #cf4b34 50%, #d8654c);
}
.aero-window .aero-caption .close:hover {
  background:
    radial-gradient(120% 90% at 50% 130%, #ff9a86, transparent 60%),
    linear-gradient(#ffc0b5 48%, #d40a0a 50%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9), 0 0 8px 2px rgba(255, 80, 48, 0.85);
}
.aero-window .aero-caption .close:active {
  background:
    radial-gradient(120% 90% at 50% 130%, #ff3a1a, transparent 60%),
    linear-gradient(#c94a3a 48%, #8b0000 50%);
}

/* ---- Menu bar ---- */
.aero-window .aero-menubar {
  display: flex;
  align-items: stretch;
  margin: 0 var(--frame);
  background: linear-gradient(#ffffff 0%, #eef2f9 45%, #dbe3f1 55%, #e9eef8 100%);
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-bottom: 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.aero-window .aero-menubar span {
  padding: 4px 10px;
  cursor: default;
  color: #1b1b1b;
}
.aero-window .aero-menubar span:hover {
  background: linear-gradient(#eaf4fd, #cfe8fb);
  box-shadow: inset 0 0 0 1px #b5dcfb;
  border-radius: 3px;
}

/* ---- Content area ---- */
.aero-window .aero-body {
  margin: 0 var(--frame);
  padding: 12px;
  min-height: ${bodyMinHeight}px;
  background: #f0f0f0;
  color: #1b1b1b;
  border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  white-space: pre-wrap;
  overflow: auto;
}
.aero-window .aero-body:last-child {
  margin-bottom: var(--frame);
  border-radius: 0 0 3px 3px;
}

/* ---- Status bar ---- */
.aero-window .aero-statusbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 var(--frame) var(--frame);
  padding: 3px 8px;
  min-height: ${STATUS_H}px;
  font-size: 11px;
  color: #1b1b1b;
  background: linear-gradient(#f7f9fc, #e4e9f2);
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-top: 0;
  border-radius: 0 0 3px 3px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.aero-window .aero-statusbar .aero-status-grow {
  flex: 1;
}
/* Resize gripper (bottom-right dots) */
.aero-window .aero-statusbar .aero-gripper {
  width: 12px;
  height: 12px;
  background:
    radial-gradient(circle 1px at 2px 10px, rgba(0, 0, 0, 0.35) 99%, transparent),
    radial-gradient(circle 1px at 6px 10px, rgba(0, 0, 0, 0.35) 99%, transparent),
    radial-gradient(circle 1px at 10px 10px, rgba(0, 0, 0, 0.35) 99%, transparent),
    radial-gradient(circle 1px at 6px 6px, rgba(0, 0, 0, 0.35) 99%, transparent),
    radial-gradient(circle 1px at 10px 6px, rgba(0, 0, 0, 0.35) 99%, transparent),
    radial-gradient(circle 1px at 10px 2px, rgba(0, 0, 0, 0.35) 99%, transparent);
}

/* ---- Inactive (unfocused) window ---- */
.aero-window.inactive::before {
  background:
    linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.08) 44%, rgba(255, 255, 255, 0) 46%),
    hsl(var(--hue) 14% 84%);
  opacity: 0.82;
}
.aero-window.inactive .aero-titlebar-text {
  color: #5a5a5a;
  text-shadow: 0 0 4px #fff, 0 0 6px #fff;
}`;
  };

  const generateHTML = () => {
    const cls = active ? "aero-window" : "aero-window inactive";
    return `<div class="${cls}">
  <div class="aero-titlebar">
    ${TITLE_ICON}
    <span class="aero-titlebar-text">${escapeHtml(windowTitle)}</span>
    <div class="aero-caption">
      <button class="min" type="button" aria-label="Minimize"></button>
      <button class="max" type="button" aria-label="Maximize"></button>
      <button class="close" type="button" aria-label="Close"></button>
    </div>
  </div>${showMenuBar ? `
  <div class="aero-menubar">
    <span>File</span>
    <span>Edit</span>
    <span>Format</span>
    <span>View</span>
    <span>Help</span>
  </div>` : ""}
  <div class="aero-body">${escapeHtml(content)}</div>${showStatusBar ? `
  <div class="aero-statusbar">
    <span>Ready</span>
    <span class="aero-status-grow"></span>
    <span>100%</span>
    <span class="aero-gripper"></span>
  </div>` : ""}
</div>`;
  };

  return (
    <AeroBackground variant="page" className="flex flex-col px-6 py-10 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="aero-title mb-3 font-bold text-4xl">
            Window Glass Generator
          </h1>
          <p className="aero-subtitle mx-auto mb-2 max-w-xl">
            Generate a self-contained Aero glass window — title bar, glossy
            caption buttons, menu bar, content and status bar. No frameworks, no
            images: just copy the CSS and HTML.
          </p>
        </div>

        <div className="gap-8 grid lg:grid-cols-2">
          {/* Controls */}
          <Card className="aero-glass">
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
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="Window body content"
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

              <div className="gap-x-6 gap-y-3 grid grid-cols-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMenuBar}
                    onChange={(e) => setShowMenuBar(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Menu Bar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStatusBar}
                    onChange={(e) => setShowStatusBar(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Status Bar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Active (focused)</span>
                </label>
              </div>
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
                className="relative flex justify-center items-center p-8 rounded-xl min-h-[400px] overflow-auto"
              >
                <style>{generateCSS()}</style>
                <div className={active ? "aero-window" : "aero-window inactive"}>
                  <div className="aero-titlebar">
                    <svg
                      className="aero-titlebar-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect x="1" y="1" width="14" height="14" rx="2" fill="#4a90d9" />
                      <rect x="4" y="4" width="8" height="1.5" rx="0.75" fill="#fff" />
                      <rect x="4" y="7" width="8" height="1.5" rx="0.75" fill="#fff" />
                      <rect x="4" y="10" width="5" height="1.5" rx="0.75" fill="#fff" />
                    </svg>
                    <span className="aero-titlebar-text">{windowTitle}</span>
                    <div className="aero-caption">
                      <button className="min" type="button" aria-label="Minimize" />
                      <button className="max" type="button" aria-label="Maximize" />
                      <button className="close" type="button" aria-label="Close" />
                    </div>
                  </div>
                  {showMenuBar && (
                    <div className="aero-menubar">
                      <span>File</span>
                      <span>Edit</span>
                      <span>Format</span>
                      <span>View</span>
                      <span>Help</span>
                    </div>
                  )}
                  <div className="aero-body">{content}</div>
                  {showStatusBar && (
                    <div className="aero-statusbar">
                      <span>Ready</span>
                      <span className="aero-status-grow" />
                      <span>100%</span>
                      <span className="aero-gripper" />
                    </div>
                  )}
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
