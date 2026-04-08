import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import fs from "fs";
import path from "path";

const PAGE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

// Directories that never map to a user-facing route
const SKIP_DIRS = new Set(["api", "node_modules", "_components", "_lib"]);

function collectRoutes(dir: string, appDir: string): string[] {
  const routes: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip hidden dirs, explicitly excluded dirs, and Next.js catch-all patterns
      if (
        entry.name.startsWith(".") ||
        entry.name.startsWith("_") ||
        SKIP_DIRS.has(entry.name)
      ) {
        continue;
      }
      routes.push(...collectRoutes(fullPath, appDir));
    } else if (PAGE_FILES.has(entry.name)) {
      const relative = path.relative(appDir, dir);
      const segments = relative
        ? relative.split(path.sep)
        : [];

      // Drop route-group segments like (marketing)
      const cleanSegments = segments.filter((s) => !/^\(.*\)$/.test(s));

      const route = cleanSegments.length ? `/${cleanSegments.join("/")}` : "/";
      routes.push(route);
    }
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "app");
  const routes = collectRoutes(appDir, appDir);

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
