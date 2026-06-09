"use client";

import { useState, useEffect } from "react";

// Grab the first full emoji (handles ZWJ/skin-tone sequences when supported)
function getFirstEmoji(str: string): string {
  const trimmed = str.trim();
  if (!trimmed) return "";
  const SegmenterCtor = (Intl as any).Segmenter;
  if (typeof SegmenterCtor === "function") {
    const seg = new SegmenterCtor(undefined, { granularity: "grapheme" });
    const first = seg.segment(trimmed)[Symbol.iterator]().next();
    return first.done ? "" : first.value.segment;
  }
  return Array.from(trimmed)[0] ?? "";
}

export default function Home() {
  const [input, setInput] = useState("😀");
  const [size, setSize] = useState(16); // N for an N×N square grid
  const [pixels, setPixels] = useState<string[]>([]);

  useEffect(() => {
    const emoji = getFirstEmoji(input);
    if (!emoji) {
      setPixels([]);
      return;
    }

    const RES = 256; // working render resolution
    const canvas = document.createElement("canvas");
    canvas.width = RES;
    canvas.height = RES;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, RES, RES);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.floor(RES * 0.8)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.fillText(emoji, RES / 2, RES / 2);

    const data = ctx.getImageData(0, 0, RES, RES).data;
    const cell = RES / size;
    const result: string[] = [];

    for (let gy = 0; gy < size; gy++) {
      for (let gx = 0; gx < size; gx++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          count = 0;
        const x0 = Math.floor(gx * cell);
        const x1 = Math.floor((gx + 1) * cell);
        const y0 = Math.floor(gy * cell);
        const y1 = Math.floor((gy + 1) * cell);

        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const idx = (y * RES + x) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
            count++;
          }
        }
        if (count > 0) {
          r /= count;
          g /= count;
          b /= count;
          a /= count;
        }
        result.push(
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${(a / 255).toFixed(3)})`,
        );
      }
    }

    setPixels(result);
  }, [input, size]);

  function downloadPng() {
    if (pixels.length === 0) return;

    const scale = Math.max(1, Math.round(512 / size)); // ~512px output, integer cells
    const out = size * scale;
    const canvas = document.createElement("canvas");
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas is transparent by default — never fill a background.
    ctx.clearRect(0, 0, out, out);
    for (let i = 0; i < pixels.length; i++) {
      const x = (i % size) * scale;
      const y = Math.floor(i / size) * scale;
      ctx.fillStyle = pixels[i]; // rgba with original alpha -> transparency preserved
      ctx.fillRect(x, y, scale, scale);
    }

    const link = document.createElement("a");
    link.download = `pixelemoji-${size}x${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center gap-8 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">PixelEmoji</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Turn any emoji into pixel art
        </p>
      </header>

      <div className="w-full max-w-xs flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-neutral-400">Emoji</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={8}
            className="rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-2xl text-center outline-none focus:border-neutral-400"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-neutral-400">
            Grid size: {size} × {size}
          </span>
          <input
            type="range"
            min={4}
            max={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="accent-neutral-300"
          />
        </label>
      </div>

      <div
        className="grid bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: 320,
          height: 320,
        }}
      >
        {pixels.map((color, i) => (
          <div key={i} style={{ backgroundColor: color }} />
        ))}
      </div>

      <button
        onClick={downloadPng}
        disabled={pixels.length === 0}
        className="rounded-lg bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Download PNG
      </button>
    </main>
  );
}
