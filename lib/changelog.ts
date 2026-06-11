export type ReleaseBadge = "launch" | "feature" | "patch";

export type Release = {
  version: string;
  date: string;
  title: string;
  badge: ReleaseBadge;
  features: string[];
};

export const releases: Release[] = [
    {
  version: "1.6",
  date: "June 2026",
  title: "Fits any screen",
  badge: "patch",
  features: [
    "Reworked the page so it scrolls gracefully on short screens instead of clipping the preview and buttons off the bottom",
  ],
},
    {
  version: "1.5",
  date: "June 2026",
  title: "Share your pixels",
  badge: "feature",
  features: [
    "New SVG export writes one crisp rectangle per cell, so your art scales to any size with zero blur — great for printing large or dropping into a design tool",
    "A Copy button puts the finished art straight on your clipboard as an image, so you can paste it into a chat or doc without touching the download folder",
    "Both the SVG and the copied image respect your Grid and background toggles, same as the PNG",
  ],
},
    {
  version: "1.4",
  date: "June 2026",
  title: "Cleaner blocks",
  badge: "feature",
  features: [
    "New Colors slider quantizes the palette down toward a handful of flat tones, trading the sampler's dozens of near-identical shades for a chunkier, more genuinely retro look",
    "A Crisp toggle snaps every faint edge cell to fully opaque or fully transparent, so the glyph's outline reads as hard blocks instead of a soft alpha haze",
    "Both settings update the preview live and carry straight through to the PNG export",
  ],
},
        {
    version: "1.3.1",
    date: "June 2026",
    title: "Tidy up!",
    badge: "patch",
    features: [
        "Tidied the layout so the controls column lines up with the preview, instead of the emoji input stretching across the page",
    ],
    },
    {
    version: "1.3",
    date: "June 2026",
    title: "Your grid, your backdrop",
    badge: "feature",
    features: [
        "A new Grid Lines toggle draws borders between every cell in the preview — makes it easy to count blocks and see exactly how each region of the glyph was sampled",
        "Background toggle switches the canvas between transparent (the default) and a solid dark fill, so colors that would otherwise vanish against the interface are easier to judge",
        "Both settings carry through to the PNG export — the preview is now a true preview",
    ],
    },
  {
    version: "1.2",
    date: "June 2026",
    title: "Dead-center, every time",
    badge: "feature",
    features: [
      "Emojis now sit perfectly centered in the grid — instead of trusting the font's metrics, PixelEmoji measures the glyph's real pixels and recenters it, so the art no longer drifts to the top-left",
      "Tall or wide emojis get squared up automatically, with an even little margin around the edge",
    ],
  },
  {
    version: "1.1",
    date: "June 2026",
    title: "Take your pixels with you",
    badge: "feature",
    features: [
      "A new Download PNG button exports your pixel art as a crisp, square image",
      "Exports keep a fully transparent background — only the emoji's blocks are drawn, so you can drop it onto anything",
      "Output scales to a clean ~512px using whole-number pixel blocks, so there are never any seams between cells",
    ],
  },
  {
    version: "1.0",
    date: "June 2026",
    title: "PixelEmoji is live",
    badge: "launch",
    features: [
      "Type any emoji and watch it rebuilt as true pixel art, sampled block-by-block from the glyph onto a square grid",
      "Dial the grid from a chunky 4×4 up to a detailed 64×64 with one slider — it updates live as you drag",
      "Every cell averages the real emoji colors, so the art stays faithful at any resolution",
      "Runs entirely in your browser — no uploads, no servers, just instant pixels",
    ],
  },
];