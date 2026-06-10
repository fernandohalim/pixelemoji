"use client";

import { useState } from "react";
import { releases, type ReleaseBadge } from "@/lib/changelog";

type AboutModalProps = { isOpen: boolean; onClose: () => void };

const SOCIALS = [
  { label: "Website", href: "https://fernando-halim.vercel.app" },
  { label: "LinkedIn", href: "https://linkedin.com/in/fernando-halimm" },
  { label: "GitHub", href: "https://github.com/fernandohalim" },
  { label: "Mail", href: "mailto:fernandohalim26@gmail.com" },
];

const badgeStyles: Record<ReleaseBadge, string> = {
  launch: "bg-amber-300/15 text-amber-300 border-amber-300/40",
  feature: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
  patch: "bg-violet-400/15 text-violet-300 border-violet-400/40",
};

const pixelFont = { fontFamily: "var(--font-press-start)" };

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [view, setView] = useState<"about" | "changelog">("about");

  if (!isOpen) return null;

  const latest = releases[0];

  const close = () => {
    onClose();
    setTimeout(() => setView("about"), 200); // reset for next open
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(36rem 26rem at 50% 0%, rgba(252,211,77,0.12), transparent 70%), rgba(8,8,12,0.82)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="fixed inset-0" onClick={close} />

      <div className="animate-pop-in relative z-10 flex max-h-[85vh] w-full max-w-sm flex-col overflow-hidden border-2 border-amber-300/60 bg-neutral-900 shadow-[6px_6px_0_0_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center border-2 border-neutral-700 bg-neutral-800 text-lg leading-none text-neutral-400 transition hover:border-amber-300/60 hover:text-amber-300 active:scale-90"
        >
          ×
        </button>

        {view === "about" ? (
          <div className="flex flex-col items-center overflow-y-auto px-6 pb-6 pt-9 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center border-2 border-amber-300/50 bg-neutral-800 text-4xl shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              🟨
            </div>

            <h2 className="text-lg text-amber-300" style={pixelFont}>
              PixelEmoji
            </h2>
            <p className="mb-6 mt-3 text-base text-neutral-400">
              Turn any emoji into pixel art.
            </p>

            <div className="flex w-full flex-col gap-2.5">
              <button
                onClick={() => setView("changelog")}
                className="flex w-full items-center gap-3 border-2 border-amber-300/30 bg-neutral-800 px-4 py-3 text-left transition hover:border-amber-300/70 active:scale-[0.98]"
              >
                <span className="text-lg">📜</span>
                <span className="flex-1 text-base font-semibold text-neutral-100">
                  Changelog
                </span>
                <span className="border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-xs text-amber-300">
                  v{latest.version} →
                </span>
              </button>

              <a
                href="https://github.com/fernandohalim/pixelemoji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 border-2 border-violet-400/30 bg-neutral-800 px-4 py-3 text-left transition hover:border-violet-400/70 active:scale-[0.98]"
              >
                <span className="text-lg">💾</span>
                <span className="flex-1 text-base font-semibold text-neutral-100">
                  Source Code
                </span>
                <span className="text-xs text-violet-300">GitHub ↗</span>
              </a>

              <div className="mt-1 grid grid-cols-4 gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center border-2 border-neutral-700 bg-neutral-800 py-2.5 text-xs text-neutral-400 transition hover:border-amber-300/50 hover:text-amber-300 active:scale-95"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <p
              className="mt-7 text-[10px] uppercase tracking-widest text-neutral-500"
              style={pixelFont}
            >
              crafted by Fernando Halim
            </p>
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b-2 border-neutral-800 px-4 py-3">
              <button
                onClick={() => setView("about")}
                aria-label="Back"
                className="flex h-8 w-8 items-center justify-center border-2 border-neutral-700 bg-neutral-800 text-neutral-300 transition hover:border-amber-300/60 hover:text-amber-300 active:scale-90"
              >
                ←
              </button>
              <h2 className="text-sm text-amber-300" style={pixelFont}>
                Changelog
              </h2>
            </div>

            <div className="scrollbar-pixel flex flex-col gap-5 overflow-y-auto px-5 py-5">
              {releases.map((r) => (
                <div key={r.version} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300" style={pixelFont}>
                      v{r.version}
                    </span>
                    <span
                      className={`border px-2 py-0.5 text-[10px] uppercase tracking-wide ${badgeStyles[r.badge]}`}
                    >
                      {r.badge}
                    </span>
                    <span className="ml-auto text-xs text-neutral-500">
                      {r.date}
                    </span>
                  </div>
                  <p className="text-lg leading-tight text-neutral-100">
                    {r.title}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {r.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-snug text-neutral-400"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 bg-amber-300/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
