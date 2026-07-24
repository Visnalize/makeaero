import { cn } from "@/lib/utils";

/**
 * Layout wrapper for a page or a preview stage.
 * - "page" is transparent so the site-wide <AeroScene /> sky shows through.
 * - "preview" paints its own little pocket of Aero sky so generated
 *   artifacts (orbs, buttons, windows) look like they're floating in it.
 */
const backgrounds = {
  page: "transparent",
  preview:
    "radial-gradient(120% 70% at 78% 6%, rgba(255,255,255,0.9), rgba(255,255,255,0) 45%)," +
    "linear-gradient(170deg, #bfe3f8 0%, #dcf0fc 45%, #f2fbff 100%)",
};

export function AeroBackground({
  variant = "page",
  className,
  children,
}: {
  variant?: "page" | "preview";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(className, variant === "preview" && "aero-stage")}
      style={variant === "preview" ? { background: backgrounds.preview } : undefined}
    >
      {children}
    </div>
  );
}
