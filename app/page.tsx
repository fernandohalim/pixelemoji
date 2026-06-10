"use client";

import { useState, useEffect, useMemo } from "react";
import { AboutModal } from "@/components/AboutModal";

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
const pixelFont = { fontFamily: "var(--font-press-start)" };

export default function Home() {
  const [input, setInput] = useState("😀");
  const [size, setSize] = useState(16);
  const [raw, setRaw] = useState<number[][]>([]);
  const [aboutOpen, setAboutOpen] = useState(false);
  // add these two:
  const [gridLines, setGridLines] = useState(false);
  const [solidBg, setSolidBg] = useState(false);
  const [crisp, setCrisp] = useState(false); // #4
  const [colorLevels, setColorLevels] = useState(8);

  useEffect(() => {
    const emoji = getFirstEmoji(input);
    if (!emoji) {
      setRaw([]);
      return;
    }

    const RES = 256;
    const src = document.createElement("canvas");
    src.width = RES;
    src.height = RES;
    const sctx = src.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    sctx.clearRect(0, 0, RES, RES);
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    sctx.font = `${Math.floor(RES * 0.8)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    sctx.fillText(emoji, RES / 2, RES / 2);

    const srcData = sctx.getImageData(0, 0, RES, RES).data;

    let minX = RES,
      minY = RES,
      maxX = -1,
      maxY = -1;
    for (let y = 0; y < RES; y++) {
      for (let x = 0; x < RES; x++) {
        if (srcData[(y * RES + x) * 4 + 3] > 8) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) {
      setRaw([]);
      return;
    }

    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const side = Math.max(bw, bh);
    const pad = Math.round(side * 0.06);
    const T = side + pad * 2;

    const cen = document.createElement("canvas");
    cen.width = T;
    cen.height = T;
    const cctx = cen.getContext("2d", { willReadFrequently: true });
    if (!cctx) return;

    cctx.clearRect(0, 0, T, T);
    const dx = pad + Math.floor((side - bw) / 2);
    const dy = pad + Math.floor((side - bh) / 2);
    cctx.drawImage(src, minX, minY, bw, bh, dx, dy, bw, bh);

    const data = cctx.getImageData(0, 0, T, T).data;
    const cell = T / size;
    const result: number[][] = [];

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
            const idx = (y * T + x) * 4;
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
        result.push([
          Math.round(r),
          Math.round(g),
          Math.round(b),
          Math.round(a),
        ]);
      }
    }

    setRaw(result);
  }, [input, size]);

  const pixels = useMemo<string[]>(() => {
    const step = colorLevels < 8 ? 255 / (colorLevels - 1) : 0;
    return raw.map(([r, g, b, a]) => {
      let alpha = a / 255;
      if (crisp) alpha = alpha >= 0.5 ? 1 : 0; // #4: snap edges hard
      let R = r,
        G = g,
        B = b;
      if (step) {
        // #2: posterize colors
        R = Math.round(Math.round(r / step) * step);
        G = Math.round(Math.round(g / step) * step);
        B = Math.round(Math.round(b / step) * step);
      }
      return `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
    });
  }, [raw, crisp, colorLevels]);

  function downloadPng() {
    if (pixels.length === 0) return;

    const scale = Math.max(1, Math.round(512 / size));
    const out = size * scale;
    const canvas = document.createElement("canvas");
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, out, out);

    // v1.3: solid background fill
    if (solidBg) {
      ctx.fillStyle = "#171717";
      ctx.fillRect(0, 0, out, out);
    }

    for (let i = 0; i < pixels.length; i++) {
      const x = (i % size) * scale;
      const y = Math.floor(i / size) * scale;
      ctx.fillStyle = pixels[i];
      ctx.fillRect(x, y, scale, scale);
    }

    // v1.3: grid lines
    if (gridLines) {
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = Math.max(1, Math.round(scale * 0.06));
      ctx.beginPath();
      for (let i = 0; i <= size; i++) {
        const p = i * scale;
        ctx.moveTo(p, 0);
        ctx.lineTo(p, out);
        ctx.moveTo(0, p);
        ctx.lineTo(out, p);
      }
      ctx.stroke();
    }

    const link = document.createElement("a");
    link.download = `pixelemoji-${size}x${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="relative h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-neutral-800/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center border border-amber-300 bg-neutral-950">
            <div className="h-2.5 w-2.5 bg-amber-300" />
          </div>
          <span className="text-xs text-amber-300" style={pixelFont}>
            PixelEmoji
          </span>
        </div>
        <button
          onClick={() => setAboutOpen(true)}
          aria-label="About"
          className="border-2 border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-300 transition hover:border-amber-300/60 hover:text-amber-300 active:scale-95"
          style={pixelFont}
        >
          ?
        </button>
      </header>

      <div className="relative z-10 flex flex-1 min-h-0 flex-col lg:flex-row items-center justify-center gap-6 lg:gap-20 px-6 py-6">
        {/* LEFT COLUMN */}
        <div className="flex w-full max-w-[320px] flex-col items-center lg:items-start gap-5">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-4 h-20 w-20 hidden items-center justify-center rounded-xl border-2 border-amber-300 bg-neutral-950 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              <div className="h-9 w-9 bg-amber-300" />
            </div>
            <h1 className="text-2xl text-amber-300" style={pixelFont}>
              PixelEmoji
            </h1>
            <p className="mt-1 text-lg text-neutral-400">
              Turn any emoji into pixel art
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-base text-neutral-400">Emoji</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={8}
                className="border-2 border-neutral-700 bg-neutral-900 px-3 py-2 text-center text-2xl outline-none focus:border-amber-300"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-base text-neutral-400">
                Grid size: {size} × {size}
              </span>
              <input
                type="range"
                min={4}
                max={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="accent-amber-300"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-base text-neutral-400">
                Colors: {colorLevels === 8 ? "Full" : `≤ ${colorLevels ** 3}`}
              </span>
              <input
                type="range"
                min={2}
                max={8}
                value={colorLevels}
                onChange={(e) => setColorLevels(Number(e.target.value))}
                className="accent-amber-300"
              />
            </label>

            {/* v1.3 toggles */}
            <div className="grid w-full grid-cols-2 gap-3">
              <button
                onClick={() => setGridLines((v) => !v)}
                aria-pressed={gridLines}
                className={`flex-1 border-2 px-3 py-2 text-[8px] transition active:scale-95 ${
                  gridLines
                    ? "border-amber-300 bg-amber-300/10 text-amber-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-amber-300/40"
                }`}
                style={pixelFont}
              >
                Grid {gridLines ? "On" : "Off"}
              </button>
              <button
                onClick={() => setSolidBg((v) => !v)}
                aria-pressed={solidBg}
                className={`flex-1 border-2 px-3 py-2 text-[8px] transition active:scale-95 ${
                  solidBg
                    ? "border-amber-300 bg-amber-300/10 text-amber-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-amber-300/40"
                }`}
                style={pixelFont}
              >
                BG {solidBg ? "Dark" : "Clear"}
              </button>
              <button
                onClick={() => setCrisp((v) => !v)}
                aria-pressed={crisp}
                className={`col-span-2 border-2 px-3 py-2 text-[8px] transition active:scale-95 ${
                  crisp
                    ? "border-amber-300 bg-amber-300/10 text-amber-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-amber-300/40"
                }`}
                style={pixelFont}
              >
                Crisp {crisp ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="grid border-2 border-neutral-800 shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              width: 320,
              height: 320,
              backgroundColor: solidBg ? "#171717" : "#0e0e0e",
              ...(solidBg
                ? null
                : {
                    backgroundImage:
                      "linear-gradient(45deg,#1c1c1c 25%,transparent 25%),linear-gradient(-45deg,#1c1c1c 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1c1c1c 75%),linear-gradient(-45deg,transparent 75%,#1c1c1c 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                  }),
            }}
          >
            {pixels.map((color, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: color,
                  ...(gridLines
                    ? {
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        borderLeft: "1px solid rgba(255,255,255,0.12)",
                      }
                    : undefined),
                }}
              />
            ))}
          </div>

          <button
            onClick={downloadPng}
            disabled={pixels.length === 0}
            className="border-2 border-amber-300 bg-amber-300 px-5 py-2.5 text-xs font-bold text-neutral-900 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition hover:bg-amber-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] disabled:opacity-40 disabled:active:translate-x-0 disabled:active:translate-y-0"
            style={pixelFont}
          >
            Download PNG
          </button>
        </div>
      </div>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
