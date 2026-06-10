<div align="center">
  <img src="public/icon.png" alt="PixelEmoji logo" width="120" />

  # PixelEmoji

  **Turn any emoji into pixel art — right in your browser.**

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React_19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

  [Live Demo](https://pixelemoji.vercel.app/) • [Report a Bug](https://github.com/fernandohalim/pixelemoji/issues)
</div>

## What is PixelEmoji?

**PixelEmoji** turns any emoji into true pixel art. Type a single emoji, pick a grid resolution, and it's resampled block-by-block into crisp, blocky art you can export as a transparent PNG. Everything runs entirely in your browser — no accounts, no uploads, no servers — so it's instant and private.

## Features

* **True pixel art:** Each emoji is drawn to a canvas and sampled cell-by-cell, averaging the real colors into a clean N×N grid — not just a blur filter.
* **Configurable resolution:** Slide from a chunky 4×4 up to a detailed 64×64 and watch the art rebuild live as you drag.
* **Always centered:** The glyph's true pixel bounds are measured and recentered, so the art never drifts regardless of platform or emoji font.
* **Transparent PNG export:** Download crisp, square images with a fully transparent background and seam-free, whole-number pixel blocks.
* **Arcade UI:** A pixel-perfect interface built on Press Start 2P + VT323 type and chunky hard-shadow controls.
* **In-app changelog:** An About modal with the project's release history folded right in.
* **100% client-side:** No backend, no uploads, no tracking — just native browser canvas APIs.

## Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Language:** TypeScript
* **Rendering:** HTML Canvas 2D API (pixel sampling + PNG export)
* **Fonts:** Press Start 2P, VT323

## Getting Started

```bash
# Clone the repository
git clone https://github.com/fernandohalim/pixelemoji.git

# Jump into the directory
cd pixelemoji

# Install the dependencies
npm install

# Start the local development server
npm run dev
```

No environment variables or API keys needed — PixelEmoji is fully client-side. Open [http://localhost:3000](http://localhost:3000) and start pixelating.