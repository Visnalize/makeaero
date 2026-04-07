import { cn } from "@/lib/utils";

const backgrounds = {
  page: `
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 20px
    ),
    linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)
  `,
  preview: `
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px,
      transparent 15px
    ),
    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
  `,
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
    <div className={cn(className)} style={{ background: backgrounds[variant] }}>
      {children}
    </div>
  );
}
