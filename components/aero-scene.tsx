/**
 * Full-viewport Frutiger Aero sky rendered once, fixed behind all content.
 * Pure CSS (no canvas) so it's cheap and SSR-friendly. Bubbles are pushed
 * toward the edges so they sit behind the empty gutters on wide screens and
 * only ever appear as soft, blurred shapes behind the frosted glass panels.
 */

// Kept deliberately bright: dark text on a saturated mid-blue can't reach
// WCAG AA, so the site sky is a softer, lighter Aero blue than the (vivid)
// wallpaper generator output. Still glossy, still bubbly, but readable.
const SKY =
  "radial-gradient(130% 45% at 50% 112%, rgba(150, 227, 178, 0.4), rgba(150, 227, 178, 0) 60%)," +
  "radial-gradient(115% 75% at 82% 2%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 45%)," +
  "linear-gradient(180deg, #7cc1ee 0%, #a3d4f2 26%, #c8e6f9 52%, #e4f3fd 78%, #f3fbff 100%)";

const IRIDESCENT =
  "conic-gradient(from 210deg," +
  " hsla(0, 90%, 78%, 0.75), hsla(45, 90%, 78%, 0.75), hsla(130, 80%, 72%, 0.75)," +
  " hsla(200, 90%, 75%, 0.75), hsla(270, 85%, 80%, 0.75), hsla(320, 90%, 80%, 0.75), hsla(0, 90%, 78%, 0.75))";

const RIM_MASK =
  "radial-gradient(closest-side, transparent 75%, #000 82%, #000 96%, transparent 100%)";

function Bubble({
  size,
  top,
  left,
  right,
  opacity = 0.5,
  blur = 0.5,
}: {
  size: number;
  top: string;
  left?: string;
  right?: string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: size,
        height: size,
        borderRadius: "50%",
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {/* Thin-film glass fill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0.06) 55%, transparent 74%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
        }}
      />
      {/* Iridescent rim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: IRIDESCENT,
          WebkitMaskImage: RIM_MASK,
          maskImage: RIM_MASK,
          mixBlendMode: "screen",
        }}
      />
      {/* Specular highlight */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "20%",
          width: "34%",
          height: "24%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.9), transparent)",
          transform: "rotate(-18deg)",
        }}
      />
    </div>
  );
}

// Hand-placed so nothing crowds the centered content column.
const BOKEH: { top: string; left: string; size: number; op: number }[] = [
  { top: "18%", left: "12%", size: 10, op: 0.5 },
  { top: "62%", left: "8%", size: 16, op: 0.35 },
  { top: "30%", left: "22%", size: 7, op: 0.45 },
  { top: "78%", left: "18%", size: 12, op: 0.3 },
  { top: "22%", left: "84%", size: 14, op: 0.4 },
  { top: "54%", left: "90%", size: 9, op: 0.45 },
  { top: "72%", left: "80%", size: 18, op: 0.3 },
  { top: "40%", left: "94%", size: 7, op: 0.5 },
];

export function AeroScene() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: SKY }}
    >
      {/* Sun bloom, top-right */}
      <div
        style={{
          position: "absolute",
          top: "-18%",
          right: "-8%",
          width: "58vw",
          height: "58vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)",
        }}
      />

      {BOKEH.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            opacity: b.op,
            background: "radial-gradient(circle, #fff, rgba(255,255,255,0) 70%)",
          }}
        />
      ))}

      <Bubble size={240} top="6%" left="-4%" opacity={0.4} blur={0.6} />
      <Bubble size={130} top="48%" left="3%" opacity={0.5} blur={0.4} />
      <Bubble size={90} top="80%" left="12%" opacity={0.55} blur={0.3} />
      <Bubble size={200} top="12%" right="-3%" opacity={0.4} blur={0.6} />
      <Bubble size={110} top="60%" right="4%" opacity={0.5} blur={0.4} />
      <Bubble size={70} top="84%" right="14%" opacity={0.55} blur={0.3} />
    </div>
  );
}
