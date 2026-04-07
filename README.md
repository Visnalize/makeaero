# Make Aero

Your go-to tools for creating authentic **Frutiger Aero** styles - glossy buttons, shiny orbs, and glass window frames, all customizable and filled with nostalgia.

**[makeaero.com](https://makeaero.com)**

## Features

### Button Generator

Create Frutiger Aero-style buttons with customizable sizes, colors, and glossy effects using the OKLCH color system. Copy the generated CSS and HTML to use anywhere.

- 10 color presets + custom hue picker
- Adjustable saturation and glow intensity
- 3 size variants (small, medium, large)
- Live preview with instant CSS output

### Glossy Orb Generator

Generate glossy orb effects in two modes:

- **CSS Orb** - configure size, color, saturation, and gloss intensity to generate pure CSS code with a radial gradient sphere and specular highlight
- **Image Orb** - upload your own logo or image, composite it inside a glossy orb effect, and download as a high-res PNG

### Window Glass Generator

Generate Windows 7 Aero-style glass window frames with:

- Configurable window title and dimensions
- Glass color and opacity controls
- Optional menu bar (File, Edit, Format, View, Help)
- Authentic title bar with min/max/close controls
- Copy both CSS and HTML output

## Tech Stack

- [Next.js](https://nextjs.org) 15 (App Router, static export)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) v3
- [shadcn/ui](https://ui.shadcn.com) components
- [Shiki](https://shiki.style) for syntax highlighting
- Canvas API for image generation

## Development

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

The site is statically exported to the `out/` directory.

## Related Projects

- [Win7 Simu](https://visnalize.com/win7simu) - Windows 7 simulator in the browser
- [Brick 1100](https://visnalize.com/brick1100) - Nokia 1100 simulator

## License

MIT
