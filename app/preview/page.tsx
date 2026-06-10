"use client";

import { useEffect, useRef } from "react";

const AMBER = "#fcd34d";
const DARK = "#0a0a0f";

// Draws the PixelEmoji mark: dark rounded tile, amber border, centered amber square.
function drawMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rounded: boolean,
) {
  const r = rounded ? size * 0.16 : 0;

  ctx.beginPath();
  ctx.roundRect(x, y, size, size, r);
  ctx.fillStyle = DARK;
  ctx.fill();

  const inset = size * 0.07;
  ctx.beginPath();
  ctx.roundRect(
    x + inset,
    y + inset,
    size - inset * 2,
    size - inset * 2,
    rounded ? r * 0.7 : 0,
  );
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.strokeStyle = AMBER;
  ctx.stroke();

  const inner = size * 0.46;
  ctx.fillStyle = AMBER;
  ctx.fillRect(x + (size - inner) / 2, y + (size - inner) / 2, inner, inner);
}

function drawLogo(canvas: HTMLCanvasElement, variant: string) {
  const S = 512;
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, S, S);
  drawMark(ctx, 0, 0, S, variant === "rounded");
}

function drawOG(
  canvas: HTMLCanvasElement,
  variant: string,
  fonts: { pixel: string; body: string },
) {
  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // faint pixel grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = 0; x <= W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  if (variant === "centered") {
    drawMark(ctx, W / 2 - 90, 80, 180, false);
    ctx.textAlign = "center";
    ctx.fillStyle = AMBER;
    ctx.font = `64px ${fonts.pixel}`;
    ctx.fillText("PixelEmoji", W / 2, 400);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `40px ${fonts.body}`;
    ctx.fillText("Turn any emoji into pixel art", W / 2, 470);
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = AMBER;
    ctx.font = `66px ${fonts.pixel}`;
    ctx.fillText("Pixel", 90, 290);
    ctx.fillText("Emoji", 90, 380);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `36px ${fonts.body}`;
    ctx.fillText("Turn any emoji into pixel art", 92, 450);
    drawMark(ctx, 800, H / 2 - 160, 320, false);
  }
}

const LOGOS = [
  { id: "logo-rounded", label: "Rounded", variant: "rounded" },
  { id: "logo-square", label: "Square", variant: "square" },
];

const OGS = [
  { id: "og-centered", label: "Centered", variant: "centered" },
  { id: "og-split", label: "Split", variant: "split" },
];

const pixelFont = { fontFamily: "var(--font-press-start)" };

export default function Preview() {
  const canvases = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (cancelled) return;

      // Resolve next/font's generated family names from probe elements.
      const pixelEl = document.getElementById("probe-pixel");
      const bodyEl = document.getElementById("probe-body");
      const fonts = {
        pixel: pixelEl ? getComputedStyle(pixelEl).fontFamily : "monospace",
        body: bodyEl ? getComputedStyle(bodyEl).fontFamily : "monospace",
      };

      LOGOS.forEach((l) => {
        const c = canvases.current[l.id];
        if (c) drawLogo(c, l.variant);
      });
      OGS.forEach((o) => {
        const c = canvases.current[o.id];
        if (c) drawOG(c, o.variant, fonts);
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const download = (id: string, filename: string) => {
    const c = canvases.current[id];
    if (!c) return;
    const a = document.createElement("a");
    a.download = filename;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      {/* hidden font probes */}
      <span
        id="probe-pixel"
        style={{
          fontFamily: "var(--font-press-start)",
          position: "absolute",
          visibility: "hidden",
        }}
      >
        P
      </span>
      <span
        id="probe-body"
        style={{
          fontFamily: "var(--font-vt323)",
          position: "absolute",
          visibility: "hidden",
        }}
      >
        P
      </span>

      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <header>
          <h1 className="text-xl text-amber-300" style={pixelFont}>
            Asset Preview
          </h1>
          <p className="mt-3 text-lg text-neutral-400">
            Temporary page — pick a logo and an OG image, download, then delete
            this route.
          </p>
        </header>

        <section className="flex flex-col gap-5">
          <h2 className="text-sm text-amber-300" style={pixelFont}>
            Logo / Icon — 512×512
          </h2>
          <div className="flex flex-wrap gap-6">
            {LOGOS.map((l) => (
              <div key={l.id} className="flex flex-col items-center gap-3">
                <div
                  className="border-2 border-neutral-800 p-3"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,#222 25%,transparent 25%),linear-gradient(-45deg,#222 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#222 75%),linear-gradient(-45deg,transparent 75%,#222 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                  }}
                >
                  <canvas
                    ref={(el) => {
                      canvases.current[l.id] = el;
                    }}
                    style={{ width: 150, height: 150, display: "block" }}
                  />
                </div>
                <button
                  onClick={() => download(l.id, `pixelemoji-${l.variant}.png`)}
                  className="border-2 border-amber-300 bg-amber-300 px-3 py-2 text-[10px] font-bold text-neutral-900 transition hover:bg-amber-200 active:scale-95"
                  style={pixelFont}
                >
                  {l.label}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-sm text-amber-300" style={pixelFont}>
            OpenGraph — 1200×630
          </h2>
          <div className="flex flex-col gap-8">
            {OGS.map((o) => (
              <div key={o.id} className="flex flex-col gap-3">
                <canvas
                  ref={(el) => {
                    canvases.current[o.id] = el;
                  }}
                  className="w-full max-w-2xl border-2 border-neutral-800"
                  style={{ height: "auto" }}
                />
                <button
                  onClick={() =>
                    download(o.id, `pixelemoji-og-${o.variant}.png`)
                  }
                  className="w-fit border-2 border-amber-300 bg-amber-300 px-3 py-2 text-[10px] font-bold text-neutral-900 transition hover:bg-amber-200 active:scale-95"
                  style={pixelFont}
                >
                  Download {o.label}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
