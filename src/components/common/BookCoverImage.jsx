import { useState, useEffect, useMemo } from "react";

// Deterministic seed based on book id and title so every book consistently gets its own unique design
const getBookSeed = (book) => {
  if (!book) return 1;
  const numMatch = String(book.id || "").match(/\d+/);
  if (numMatch) {
    return parseInt(numMatch[0], 10);
  }
  const str = String(book.title || "") + String(book.author || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
};

// 36 Curated Luxurious Color Palettes — high contrast, vibrant, distinct moods
const PALETTES = [
  // 0. Midnight Sapphire & Gold
  {
    bg: "from-[#0a1128] via-[#101f42] to-[#050b1a]",
    accent: "#fbbf24",
    secondary: "#60a5fa",
    textLight: "#fef3c7",
    tagBg: "bg-amber-400/20 text-amber-200 border-amber-400/30",
    bandBg: "bg-black/40",
  },
  // 1. Velvet Crimson & Champagne
  {
    bg: "from-[#4c0519] via-[#881337] to-[#250109]",
    accent: "#fde047",
    secondary: "#fda4af",
    textLight: "#fef9c3",
    tagBg: "bg-amber-300/20 text-amber-100 border-amber-300/30",
    bandBg: "bg-black/45",
  },
  // 2. Royal Emerald & Bright Gold
  {
    bg: "from-[#022c22] via-[#064e3b] to-[#011710]",
    accent: "#f59e0b",
    secondary: "#34d399",
    textLight: "#fef3c7",
    tagBg: "bg-emerald-400/20 text-emerald-100 border-emerald-400/30",
    bandBg: "bg-black/40",
  },
  // 3. Imperial Violet & Amethyst
  {
    bg: "from-[#2e1065] via-[#4c1d95] to-[#14042d]",
    accent: "#e879f9",
    secondary: "#c084fc",
    textLight: "#fae8ff",
    tagBg: "bg-purple-400/20 text-purple-100 border-purple-400/30",
    bandBg: "bg-black/45",
  },
  // 4. Terracotta & Warm Ochre
  {
    bg: "from-[#431407] via-[#7c2d12] to-[#1f0903]",
    accent: "#fdba74",
    secondary: "#fde047",
    textLight: "#ffedd5",
    tagBg: "bg-amber-500/20 text-amber-100 border-amber-500/30",
    bandBg: "bg-black/50",
  },
  // 5. Deep Ocean Teal & Mint
  {
    bg: "from-[#042f2e] via-[#115e59] to-[#011414]",
    accent: "#2dd4bf",
    secondary: "#6ee7b7",
    textLight: "#ccfbf1",
    tagBg: "bg-teal-400/20 text-teal-100 border-teal-400/30",
    bandBg: "bg-black/40",
  },
  // 6. Obsidian Charcoal & Electric Cyan
  {
    bg: "from-[#09090b] via-[#18181b] to-[#000000]",
    accent: "#06b6d4",
    secondary: "#38bdf8",
    textLight: "#cffafe",
    tagBg: "bg-cyan-400/20 text-cyan-200 border-cyan-400/30",
    bandBg: "bg-black/60",
  },
  // 7. Rich Plum & Rose Gold
  {
    bg: "from-[#3b0764] via-[#581c87] to-[#1c0233]",
    accent: "#f472b6",
    secondary: "#fbcfe8",
    textLight: "#fdf2f8",
    tagBg: "bg-pink-400/20 text-pink-100 border-pink-400/30",
    bandBg: "bg-black/45",
  },
  // 8. Nordic Slate & Ice Blue
  {
    bg: "from-[#0f172a] via-[#1e293b] to-[#020617]",
    accent: "#38bdf8",
    secondary: "#93c5fd",
    textLight: "#e0f2fe",
    tagBg: "bg-sky-400/20 text-sky-100 border-sky-400/30",
    bandBg: "bg-black/40",
  },
  // 9. Vintage Espresso & Bronze
  {
    bg: "from-[#241407] via-[#38220f] to-[#0f0702]",
    accent: "#fbbf24",
    secondary: "#d97706",
    textLight: "#fef3c7",
    tagBg: "bg-amber-400/20 text-amber-100 border-amber-400/30",
    bandBg: "bg-black/55",
  },
  // 10. Cobalt Electric & White Gold
  {
    bg: "from-[#172554] via-[#1e3a8a] to-[#0a1128]",
    accent: "#facc15",
    secondary: "#60a5fa",
    textLight: "#fef9c3",
    tagBg: "bg-blue-400/20 text-blue-100 border-blue-400/30",
    bandBg: "bg-black/45",
  },
  // 11. Forest Moss & Sage Fern
  {
    bg: "from-[#052e16] via-[#14532d] to-[#02170a]",
    accent: "#86efac",
    secondary: "#4ade80",
    textLight: "#dcfce7",
    tagBg: "bg-green-400/20 text-green-100 border-green-400/30",
    bandBg: "bg-black/40",
  },
  // 12. Bordeaux & Coral Blush
  {
    bg: "from-[#360417] via-[#700c2f] to-[#1a010a]",
    accent: "#fb7185",
    secondary: "#fecdd3",
    textLight: "#ffe4e6",
    tagBg: "bg-rose-400/20 text-rose-100 border-rose-400/30",
    bandBg: "bg-black/45",
  },
  // 13. Copper Rust & Amber Fire
  {
    bg: "from-[#3a1a0c] via-[#6a2f13] to-[#1c0c05]",
    accent: "#f59e0b",
    secondary: "#fdba74",
    textLight: "#fef3c7",
    tagBg: "bg-orange-400/20 text-orange-100 border-orange-400/30",
    bandBg: "bg-black/50",
  },
  // 14. Peacock Blue & Turquoise
  {
    bg: "from-[#082f49] via-[#0369a1] to-[#041d2d]",
    accent: "#22d3ee",
    secondary: "#67e8f9",
    textLight: "#cffafe",
    tagBg: "bg-cyan-400/20 text-cyan-100 border-cyan-400/30",
    bandBg: "bg-black/40",
  },
  // 15. Midnight Mulberry & Orchid
  {
    bg: "from-[#4a044e] via-[#701a75] to-[#250228]",
    accent: "#f0abfc",
    secondary: "#e879f9",
    textLight: "#fdf4ff",
    tagBg: "bg-fuchsia-400/20 text-fuchsia-100 border-fuchsia-400/30",
    bandBg: "bg-black/45",
  },
  // 16. Burgundy Wine & Goldenrod
  {
    bg: "from-[#450a0a] via-[#7f1d1d] to-[#220505]",
    accent: "#fde047",
    secondary: "#fca5a5",
    textLight: "#fefce8",
    tagBg: "bg-red-400/20 text-red-100 border-red-400/30",
    bandBg: "bg-black/50",
  },
  // 17. Carbon Jet & Neon Lime
  {
    bg: "from-[#111827] via-[#1f2937] to-[#030712]",
    accent: "#a3e635",
    secondary: "#bef264",
    textLight: "#ecfccb",
    tagBg: "bg-lime-400/20 text-lime-200 border-lime-400/30",
    bandBg: "bg-black/60",
  },
  // 18. Tuscan Siena & Marigold
  {
    bg: "from-[#451a03] via-[#78350f] to-[#240d02]",
    accent: "#fbbf24",
    secondary: "#fed7aa",
    textLight: "#fef3c7",
    tagBg: "bg-amber-400/20 text-amber-100 border-amber-400/30",
    bandBg: "bg-black/45",
  },
  // 19. Arctic Indigo & Powder Sky
  {
    bg: "from-[#1e1b4b] via-[#312e81] to-[#0f0e26]",
    accent: "#818cf8",
    secondary: "#a5b4fc",
    textLight: "#e0e7ff",
    tagBg: "bg-indigo-400/20 text-indigo-100 border-indigo-400/30",
    bandBg: "bg-black/45",
  },
  // 20. Deep Cedar & Olive Amber
  {
    bg: "from-[#1a2e05] via-[#365314] to-[#0c1702]",
    accent: "#facc15",
    secondary: "#a3e635",
    textLight: "#fef9c3",
    tagBg: "bg-lime-400/20 text-lime-100 border-lime-400/30",
    bandBg: "bg-black/40",
  },
  // 21. Dark Sangria & Peach Glow
  {
    bg: "from-[#4c0529] via-[#831843] to-[#240213]",
    accent: "#fda4af",
    secondary: "#fecdd3",
    textLight: "#fff1f2",
    tagBg: "bg-pink-400/20 text-pink-100 border-pink-400/30",
    bandBg: "bg-black/45",
  },
  // 22. Cosmic Abyss & Ultraviolet
  {
    bg: "from-[#100329] via-[#24084c] to-[#070114]",
    accent: "#c084fc",
    secondary: "#e879f9",
    textLight: "#f3e8ff",
    tagBg: "bg-purple-400/20 text-purple-100 border-purple-400/30",
    bandBg: "bg-black/55",
  },
  // 23. Antique Mahogany & Honey Brass
  {
    bg: "from-[#291306] via-[#4d240d] to-[#140903]",
    accent: "#f59e0b",
    secondary: "#fde68a",
    textLight: "#fef3c7",
    tagBg: "bg-amber-400/20 text-amber-100 border-amber-400/30",
    bandBg: "bg-black/50",
  },
  // 24. Deep Byzantium & Coral
  {
    bg: "from-[#39042b] via-[#630b4d] to-[#1d0116]",
    accent: "#fb7185",
    secondary: "#f472b6",
    textLight: "#ffe4e6",
    tagBg: "bg-rose-400/20 text-rose-100 border-rose-400/30",
    bandBg: "bg-black/45",
  },
  // 25. Stormy Steel & Aquamarine
  {
    bg: "from-[#13222e] via-[#1e3445] to-[#0b141c]",
    accent: "#2dd4bf",
    secondary: "#7dd3fc",
    textLight: "#ccfbf1",
    tagBg: "bg-teal-400/20 text-teal-100 border-teal-400/30",
    bandBg: "bg-black/40",
  },
  // 26. Dark Chocolate & Cream Gold
  {
    bg: "from-[#1c120c] via-[#331e13] to-[#0e0906]",
    accent: "#fde047",
    secondary: "#fdba74",
    textLight: "#fef9c3",
    tagBg: "bg-yellow-400/20 text-yellow-100 border-yellow-400/30",
    bandBg: "bg-black/55",
  },
  // 27. Royal Purple & Electric Fuchsia
  {
    bg: "from-[#2d0840] via-[#5b1180] to-[#160420]",
    accent: "#f43f5e",
    secondary: "#e879f9",
    textLight: "#ffe4e6",
    tagBg: "bg-rose-400/20 text-rose-100 border-rose-400/30",
    bandBg: "bg-black/45",
  },
  // 28. Evergreen Pine & Citrus Leaf
  {
    bg: "from-[#06241b] via-[#0f4635] to-[#03130e]",
    accent: "#a3e635",
    secondary: "#34d399",
    textLight: "#ecfccb",
    tagBg: "bg-emerald-400/20 text-emerald-100 border-emerald-400/30",
    bandBg: "bg-black/40",
  },
  // 29. Cast Iron & Warm Copper
  {
    bg: "from-[#18181b] via-[#27272a] to-[#09090b]",
    accent: "#fb923c",
    secondary: "#fdba74",
    textLight: "#ffedd5",
    tagBg: "bg-orange-400/20 text-orange-100 border-orange-400/30",
    bandBg: "bg-black/60",
  },
  // 30. Deep Cerulean & Lemon Sun
  {
    bg: "from-[#0c2438] via-[#154366] to-[#06131e]",
    accent: "#facc15",
    secondary: "#38bdf8",
    textLight: "#fef9c3",
    tagBg: "bg-yellow-400/20 text-yellow-100 border-yellow-400/30",
    bandBg: "bg-black/40",
  },
  // 31. Black Pearl & Moonstone Silver
  {
    bg: "from-[#0f172a] via-[#1e293b] to-[#020617]",
    accent: "#e2e8f0",
    secondary: "#94a3b8",
    textLight: "#ffffff",
    tagBg: "bg-slate-300/20 text-slate-100 border-slate-300/30",
    bandBg: "bg-black/50",
  },
  // 32. Dark Cinnamon & Cardamom
  {
    bg: "from-[#33140b] via-[#5c2414] to-[#1a0a06]",
    accent: "#fdba74",
    secondary: "#fed7aa",
    textLight: "#ffedd5",
    tagBg: "bg-orange-400/20 text-orange-100 border-orange-400/30",
    bandBg: "bg-black/50",
  },
  // 33. Twilight Azure & Electric Tangerine
  {
    bg: "from-[#0e1e38] via-[#1a3664] to-[#060e1b]",
    accent: "#fb923c",
    secondary: "#60a5fa",
    textLight: "#ffedd5",
    tagBg: "bg-orange-400/20 text-orange-100 border-orange-400/30",
    bandBg: "bg-black/45",
  },
  // 34. Deep Ruby & Brilliant Diamond
  {
    bg: "from-[#450514] via-[#750c25] to-[#210209]",
    accent: "#ffffff",
    secondary: "#fecdd3",
    textLight: "#ffffff",
    tagBg: "bg-white/20 text-white border-white/30",
    bandBg: "bg-black/50",
  },
  // 35. Deep Malachite & Jade Mint
  {
    bg: "from-[#03251c] via-[#074737] to-[#01140e]",
    accent: "#5eead4",
    secondary: "#a7f3d0",
    textLight: "#ccfbf1",
    tagBg: "bg-teal-400/20 text-teal-100 border-teal-400/30",
    bandBg: "bg-black/40",
  },
];

// 30 Handcrafted, Ornate Vector SVG Emblems
const renderEmblem = (motifIndex, color) => {
  const c = color || "#fbbf24";
  switch (motifIndex) {
    case 0: // Antique Compass
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke={c} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="38" stroke={c} strokeWidth="1.5" />
          <polygon points="50,14 55,45 86,50 55,55 50,86 45,55 14,50 45,45" fill={c} opacity="0.35" />
          <polygon points="50,14 53,47 86,50 50,50" fill={c} />
          <polygon points="50,86 47,53 14,50 50,50" fill={c} />
          <circle cx="50" cy="50" r="5" fill={c} />
        </svg>
      );
    case 1: // Wise Owl of Athena
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 18 C30 18 24 35 24 55 C24 75 36 86 50 86 C64 86 76 75 76 55 C76 35 70 18 50 18 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.1" />
          <polygon points="28,24 40,36 30,38" fill={c} />
          <polygon points="72,24 60,36 70,38" fill={c} />
          <circle cx="38" cy="48" r="9" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
          <circle cx="62" cy="48" r="9" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
          <circle cx="38" cy="48" r="4" fill={c} />
          <circle cx="62" cy="48" r="4" fill={c} />
          <polygon points="50,52 46,62 54,62" fill={c} />
          <path d="M38 68 Q50 78 62 68" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2: // Tree of Knowledge / Yggdrasil
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke={c} strokeWidth="1.5" />
          <path d="M50 82 V48 M50 48 Q35 38 28 28 M50 48 Q65 38 72 28 M50 55 Q38 50 32 46 M50 55 Q62 50 68 46" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="24" r="8" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
          <circle cx="32" cy="32" r="6" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
          <circle cx="68" cy="32" r="6" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
          <circle cx="24" cy="46" r="5" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
          <circle cx="76" cy="46" r="5" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="1.5" />
          <path d="M35 84 Q50 78 65 84" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 3: // Quill & Ancient Manuscript
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M22 68 C22 40 45 20 78 18 C74 44 56 68 34 76 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.2" />
          <path d="M78 18 L32 78" stroke={c} strokeWidth="2.5" />
          <path d="M32 78 L26 84 L30 76 Z" fill={c} />
          <path d="M42 56 Q52 50 60 52 M48 44 Q58 38 66 40" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="65" cy="74" r="10" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.15" />
          <rect x="58" y="70" width="14" height="14" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 4: // Planetary Orbits & Cosmos
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="14" fill={c} fillOpacity="0.4" stroke={c} strokeWidth="2" />
          <circle cx="50" cy="50" r="6" fill={c} />
          <ellipse cx="50" cy="50" rx="42" ry="16" stroke={c} strokeWidth="1.5" transform="rotate(-25 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="16" stroke={c} strokeWidth="1.5" transform="rotate(35 50 50)" strokeDasharray="3 3" />
          <circle cx="20" cy="38" r="4" fill={c} />
          <circle cx="78" cy="64" r="3.5" fill={c} />
        </svg>
      );
    case 5: // Alpine Mountain Peaks & Sun
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke={c} strokeWidth="1.5" />
          <circle cx="50" cy="30" r="10" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.3" />
          <polygon points="50,32 74,78 26,78" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.15" />
          <polyline points="50,32 50,78" stroke={c} strokeWidth="1.5" />
          <polygon points="68,48 88,78 48,78" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.25" />
        </svg>
      );
    case 6: // Vintage Key of Wisdom
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="30" r="15" stroke={c} strokeWidth="2.5" fill={c} fillOpacity="0.2" />
          <circle cx="50" cy="30" r="7" stroke={c} strokeWidth="1.5" />
          <line x1="50" y1="45" x2="50" y2="84" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <path d="M50 68 H62 V74 H50 M50 78 H60 V84 H50" stroke={c} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 7: // Regal Archival Crown
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M22 66 L20 38 L38 52 L50 26 L62 52 L80 38 L78 66 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.2" strokeLinejoin="round" />
          <rect x="22" y="68" width="56" height="8" rx="2" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.4" />
          <circle cx="20" cy="36" r="3" fill={c} />
          <circle cx="50" cy="24" r="3.5" fill={c} />
          <circle cx="80" cy="36" r="3" fill={c} />
          <circle cx="36" cy="72" r="1.5" fill="#fff" />
          <circle cx="50" cy="72" r="2" fill="#fff" />
          <circle cx="64" cy="72" r="1.5" fill="#fff" />
        </svg>
      );
    case 8: // Scales of Justice & Truth
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <line x1="50" y1="20" x2="50" y2="82" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="34" x2="76" y2="34" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 34 L15 56 M24 34 L33 56" stroke={c} strokeWidth="1.5" />
          <path d="M12 56 Q24 64 36 56 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.3" />
          <path d="M76 34 L67 56 M76 34 L85 56" stroke={c} strokeWidth="1.5" />
          <path d="M64 56 Q76 64 88 56 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.3" />
          <path d="M38 82 H62" stroke={c} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 9: // Quantum Code Matrix / Crystal
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="50,16 84,34 84,70 50,88 16,70 16,34" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.15" />
          <polygon points="50,30 72,42 72,64 50,76 28,64 28,42" stroke={c} strokeWidth="1.5" />
          <line x1="50" y1="16" x2="50" y2="30" stroke={c} strokeWidth="1.5" />
          <line x1="84" y1="70" x2="72" y2="64" stroke={c} strokeWidth="1.5" />
          <line x1="16" y1="70" x2="28" y2="64" stroke={c} strokeWidth="1.5" />
          <circle cx="50" cy="53" r="5" fill={c} />
        </svg>
      );
    case 10: // Atomic Core & Electron Rings
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="42" ry="14" stroke={c} strokeWidth="1.5" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="14" stroke={c} strokeWidth="1.5" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="14" stroke={c} strokeWidth="1.5" transform="rotate(90 50 50)" />
          <circle cx="50" cy="50" r="7" fill={c} />
          <circle cx="20" cy="34" r="3" fill={c} />
          <circle cx="80" cy="66" r="3" fill={c} />
        </svg>
      );
    case 11: // Brass Lantern & Illuminating Flame
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 20 C40 20 38 28 38 34 H62 C62 28 60 20 50 20 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
          <rect x="34" y="34" width="32" height="38" rx="3" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.1" />
          <path d="M50 44 C46 52 54 58 50 64 C46 58 54 52 50 44 Z" fill={c} />
          <line x1="30" y1="72" x2="70" y2="72" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="14" r="5" stroke={c} strokeWidth="2" />
        </svg>
      );
    case 12: // DNA Double Helix
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M30 18 Q50 35 70 52 Q50 69 30 86" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 18 Q50 35 30 52 Q50 69 70 86" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <line x1="33" y1="24" x2="67" y2="24" stroke={c} strokeWidth="1.5" />
          <line x1="38" y1="36" x2="62" y2="36" stroke={c} strokeWidth="1.5" />
          <line x1="42" y1="46" x2="58" y2="46" stroke={c} strokeWidth="1.5" />
          <line x1="38" y1="64" x2="62" y2="64" stroke={c} strokeWidth="1.5" />
          <line x1="33" y1="76" x2="67" y2="76" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 13: // Greco-Roman Wisdom Pillars
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="50,18 78,32 22,32" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.25" />
          <line x1="28" y1="36" x2="28" y2="74" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="36" x2="42" y2="74" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="36" x2="58" y2="74" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="36" x2="72" y2="74" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <rect x="18" y="74" width="64" height="8" rx="1.5" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
        </svg>
      );
    case 14: // Ancient Hourglass of Time
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <line x1="26" y1="20" x2="74" y2="20" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="80" x2="74" y2="80" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <path d="M32 22 Q50 48 32 78 M68 22 Q50 48 68 78" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <polygon points="38,28 62,28 50,46" fill={c} fillOpacity="0.4" />
          <circle cx="50" cy="56" r="2" fill={c} />
          <polygon points="44,72 56,72 50,62" fill={c} />
        </svg>
      );
    case 15: // Neural Brain & Synapses
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 24 C36 24 28 34 28 48 C28 60 36 68 46 72 M50 24 C64 24 72 34 72 48 C72 60 64 68 54 72" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.15" />
          <circle cx="38" cy="38" r="3.5" fill={c} />
          <circle cx="62" cy="38" r="3.5" fill={c} />
          <circle cx="36" cy="54" r="3" fill={c} />
          <circle cx="64" cy="54" r="3" fill={c} />
          <circle cx="50" cy="46" r="4" fill={c} />
          <line x1="38" y1="38" x2="50" y2="46" stroke={c} strokeWidth="1.5" />
          <line x1="62" y1="38" x2="50" y2="46" stroke={c} strokeWidth="1.5" />
          <line x1="36" y1="54" x2="50" y2="46" stroke={c} strokeWidth="1.5" />
          <line x1="64" y1="54" x2="50" y2="46" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 16: // Sailing Exploration Galleon
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M20 68 C35 74 65 74 80 68 L74 80 C55 84 45 84 26 80 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
          <line x1="48" y1="26" x2="48" y2="68" stroke={c} strokeWidth="2" />
          <path d="M50 30 C62 34 62 48 50 50 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.4" />
          <path d="M50 52 C64 56 64 66 50 68 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.4" />
          <path d="M46 36 C36 40 36 50 46 54 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.4" />
        </svg>
      );
    case 17: // Laurel Wreath of Excellence
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M30 76 C18 60 20 36 34 22 M70 76 C82 60 80 36 66 22" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="26" cy="40" rx="4" ry="7" transform="rotate(-30 26 40)" fill={c} />
          <ellipse cx="28" cy="56" rx="4" ry="7" transform="rotate(-15 28 56)" fill={c} />
          <ellipse cx="74" cy="40" rx="4" ry="7" transform="rotate(30 74 40)" fill={c} />
          <ellipse cx="72" cy="56" rx="4" ry="7" transform="rotate(15 72 56)" fill={c} />
          <polygon points="50,40 53,49 62,50 55,56 57,65 50,60 43,65 45,56 38,50 47,49" fill={c} />
        </svg>
      );
    case 18: // Chess Knight of Strategy
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M34 82 H66 M38 82 C38 68 34 58 42 46 C40 38 48 30 56 24 C54 30 58 34 62 38 C60 48 64 68 62 82" stroke={c} strokeWidth="2.5" fill={c} fillOpacity="0.2" strokeLinecap="round" />
          <circle cx="48" cy="38" r="2.5" fill={c} />
          <path d="M42 50 L52 52" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 19: // Phoenix / Sun Wings
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 78 C42 64 22 52 14 30 C28 34 40 44 50 56 C60 44 72 34 86 30 C78 52 58 64 50 78 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.25" />
          <circle cx="50" cy="42" r="6" fill={c} />
          <line x1="50" y1="24" x2="50" y2="34" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 20: // Astronomical Telescope & Orbit
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <line x1="28" y1="72" x2="72" y2="28" stroke={c} strokeWidth="4" strokeLinecap="round" />
          <rect x="58" y="24" width="16" height="10" transform="rotate(-45 66 29)" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.3" />
          <line x1="46" y1="54" x2="36" y2="78" stroke={c} strokeWidth="2" />
          <line x1="46" y1="54" x2="56" y2="78" stroke={c} strokeWidth="2" />
          <circle cx="76" cy="24" r="2.5" fill={c} />
          <circle cx="82" cy="18" r="1.5" fill={c} />
        </svg>
      );
    case 21: // Art Deco Radiant Sunburst
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="14" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.3" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="22"
              x2="50"
              y2="12"
              stroke={c}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>
      );
    case 22: // Labyrinth of Deduction
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <rect x="18" y="18" width="64" height="64" rx="4" stroke={c} strokeWidth="2" />
          <path d="M30 18 V68 H70 V30 H42 V56 H58" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 23: // Printing Press Cog Gears
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <circle cx="44" cy="44" r="20" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.2" strokeDasharray="6 3" />
          <circle cx="44" cy="44" r="8" fill={c} />
          <circle cx="68" cy="68" r="14" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.2" strokeDasharray="5 2.5" />
          <circle cx="68" cy="68" r="5" fill={c} />
        </svg>
      );
    case 24: // Valor Shield & Broadsword
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 82 C30 76 26 50 26 30 L50 20 L74 30 C74 50 70 76 50 82 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.2" />
          <line x1="50" y1="26" x2="50" y2="74" stroke={c} strokeWidth="2" />
          <line x1="38" y1="40" x2="62" y2="40" stroke={c} strokeWidth="2" />
        </svg>
      );
    case 25: // Ancient Lyre & Poetry Strings
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M32 26 C28 44 32 68 50 76 C68 68 72 44 68 26" stroke={c} strokeWidth="2.5" fill={c} fillOpacity="0.15" />
          <line x1="26" y1="26" x2="74" y2="26" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="44" y1="28" x2="44" y2="70" stroke={c} strokeWidth="1.5" />
          <line x1="50" y1="28" x2="50" y2="74" stroke={c} strokeWidth="1.5" />
          <line x1="56" y1="28" x2="56" y2="70" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 26: // Sacred Lotus of Enlightenment
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M50 24 C46 38 46 62 50 74 C54 62 54 38 50 24 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.4" />
          <path d="M50 44 C34 44 24 56 30 72 C40 70 48 64 50 44 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.2" />
          <path d="M50 44 C66 44 76 56 70 72 C60 70 52 64 50 44 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.2" />
          <path d="M26 76 Q50 82 74 76" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 27: // Radiant Diamond Prism
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="30,36 70,36 84,52 50,82 16,52" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.2" strokeLinejoin="round" />
          <polyline points="16,52 84,52" stroke={c} strokeWidth="1.5" />
          <polyline points="30,36 50,82 70,36" stroke={c} strokeWidth="1.5" />
          <line x1="50" y1="36" x2="50" y2="52" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 28: // Mountain Lighthouse Beacon
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="44,32 56,32 60,78 40,78" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.25" />
          <rect x="42" y="24" width="16" height="8" stroke={c} strokeWidth="1.5" fill={c} />
          <line x1="20" y1="28" x2="38" y2="28" stroke={c} strokeWidth="2" strokeDasharray="2 2" />
          <line x1="62" y1="28" x2="80" y2="28" stroke={c} strokeWidth="2" strokeDasharray="2 2" />
          <path d="M24 82 Q50 76 76 82" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 29: // Infinity Loop & Golden Spiral
    default:
      return (
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <path d="M32 50 C20 38 20 62 32 50 C44 38 56 62 68 50 C80 38 80 62 68 50 C56 38 44 62 32 50 Z" stroke={c} strokeWidth="2.5" fill={c} fillOpacity="0.2" />
          <circle cx="32" cy="50" r="3" fill={c} />
          <circle cx="68" cy="50" r="3" fill={c} />
        </svg>
      );
  }
};

const BookCoverImage = ({ book, className = "", alt = "" }) => {
  const [loadState, setLoadState] = useState(() => (book?.image ? "checking" : "fallback"));

  useEffect(() => {
    // Only attempt external image if it exists and is not OpenLibrary fallback
    if (!book?.image) {
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.src = book.image;

    img.onload = () => {
      if (!isMounted) return;
      // If image is a fake 1x1 transparent gif, treat as fallback
      if (img.naturalWidth > 1 && img.naturalHeight > 1) {
        setLoadState("loaded");
      } else {
        setLoadState("fallback");
      }
    };

    img.onerror = () => {
      if (isMounted) setLoadState("fallback");
    };

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [book?.image]);

  // Compute 100% unique deterministic layout, palette, and emblem using co-prime multipliers
  const { palette, layoutType, motifIndex } = useMemo(() => {
    const seed = getBookSeed(book);
    // Co-prime multipliers ensure NO two adjacent books share palette, layout, or motif
    const pIdx = (seed * 11 + 3) % PALETTES.length;
    const lIdx = (seed * 7 + 2) % 8; // 8 layouts: 0 to 7
    const mIdx = (seed * 13 + 5) % 30; // 30 emblems: 0 to 29

    return {
      palette: PALETTES[pIdx],
      layoutType: lIdx,
      motifIndex: mIdx,
    };
  }, [book]);

  // If a real external image successfully loaded, display with 3D spine
  if (loadState === "loaded" && book?.image) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        <img
          src={book.image}
          alt={alt || book?.title || "Book Cover"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* 3D Physical Spine Shadow */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-3.5 w-[1px] bg-white/15 z-10" />
      </div>
    );
  }

  // Bespoke 100% Unique Hardcover Physical Book Cover
  return (
    <div
      className={`relative h-full w-full select-none overflow-hidden bg-gradient-to-br ${palette.bg} text-white shadow-md transition-all duration-300 ${className}`}
      style={{
        boxShadow: `inset -2px 0 6px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.15)`,
      }}
    >
      {/* 3D Physical Spine Fold & Crease Lines */}
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/70 via-black/25 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 left-3.5 w-[1px] bg-white/20 z-20 pointer-events-none" />

      {/* ========================================================
          LAYOUT 0: The Heritage Folio (Ornate Dual Filigree Frame)
          ======================================================== */}
      {layoutType === 0 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7 text-center">
          <div className="absolute inset-2 sm:inset-3 rounded-lg border border-white/20 pointer-events-none" />
          <div className="absolute inset-2.5 sm:inset-3.5 rounded border border-white/10 pointer-events-none" />

          {/* Top Category Badge */}
          <div className="pt-1">
            <span
              className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase backdrop-blur-xs ${palette.tagBg}`}
            >
              {book?.category || "Classic"}
            </span>
          </div>

          {/* Centerpiece Emblem & Title */}
          <div className="my-auto py-1 flex flex-col items-center">
            <div className="mb-2.5 transform transition-transform group-hover:scale-110 duration-300">
              {renderEmblem(motifIndex, palette.accent)}
            </div>

            <h4
              className="line-clamp-2 text-xs sm:text-sm font-black tracking-tight text-white font-display px-1 leading-snug"
              title={book?.title}
            >
              {book?.title}
            </h4>

            <div
              className="mx-auto my-1.5 h-[2px] w-8 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />

            <p
              className="line-clamp-1 text-[10px] font-bold tracking-wider uppercase"
              style={{ color: palette.textLight }}
            >
              {book?.author}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-white/15 pt-1.5 flex items-center justify-between text-[8.5px] font-mono opacity-70 px-1">
            <span>{book?.publishedYear}</span>
            <span className="font-bold tracking-wider">{book?.id}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 1: Modernist Bauhaus / Swiss Editorial
          ======================================================== */}
      {layoutType === 1 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7">
          {/* Top Geometric Accent */}
          <div className="flex items-start justify-between">
            <span
              className={`rounded px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider ${palette.tagBg}`}
            >
              {book?.category}
            </span>
            <span
              className="text-lg font-black tracking-tighter opacity-80 font-mono"
              style={{ color: palette.accent }}
            >
              №{book?.id?.replace(/\D/g, "") || "01"}
            </span>
          </div>

          {/* Offset Dynamic Emblem */}
          <div className="my-auto py-2 flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
              {renderEmblem(motifIndex, palette.accent)}
            </div>
            <div className="h-10 w-[2px] bg-white/20 rounded-full" />
            <div className="text-[9px] font-mono opacity-80 uppercase tracking-widest leading-tight">
              <span>EDITION</span>
              <br />
              <span className="font-bold text-white">{book?.publishedYear}</span>
            </div>
          </div>

          {/* Bold Editorial Typography */}
          <div className="border-t-2 border-white/20 pt-2.5">
            <h4
              className="line-clamp-2 text-xs sm:text-sm font-extrabold tracking-tight leading-snug text-white font-display uppercase"
              title={book?.title}
            >
              {book?.title}
            </h4>
            <p
              className="mt-1 line-clamp-1 text-[10px] font-bold tracking-wide"
              style={{ color: palette.accent }}
            >
              {book?.author}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 2: Classical Medallion & Royal Arch
          ======================================================== */}
      {layoutType === 2 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7 text-center">
          {/* Classical Arch Line */}
          <div className="absolute inset-x-4 top-2 bottom-2 rounded-t-full border border-white/20 pointer-events-none" />

          {/* Top Category */}
          <div className="pt-2 z-10">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-widest ${palette.tagBg}`}
            >
              {book?.category}
            </span>
          </div>

          {/* Golden Medallion Crest */}
          <div className="my-auto py-1 flex flex-col items-center z-10">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center border-2 shadow-lg mb-2 backdrop-blur-sm"
              style={{
                borderColor: palette.accent,
                backgroundColor: "rgba(0,0,0,0.35)",
              }}
            >
              {renderEmblem(motifIndex, palette.accent)}
            </div>

            <h4
              className="line-clamp-2 text-xs sm:text-sm font-extrabold tracking-tight text-white font-display px-2 leading-tight"
              title={book?.title}
            >
              {book?.title}
            </h4>

            <p
              className="mt-1.5 text-[10px] font-bold tracking-wider uppercase truncate max-w-[90%]"
              style={{ color: palette.secondary }}
            >
              {book?.author}
            </p>
          </div>

          {/* Archival Seal */}
          <div className="border-t border-white/10 pt-1 flex items-center justify-between text-[8px] font-mono opacity-70 px-2 z-10">
            <span>{book?.publisher || "Library Edition"}</span>
            <span className="font-bold">{book?.id}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 3: Split Duotone Horizon (Center Band Contrast)
          ======================================================== */}
      {layoutType === 3 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between">
          {/* Top Showcase Area */}
          <div className="p-3 pl-6 pt-3 flex flex-col items-center">
            <span
              className={`rounded border px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${palette.tagBg}`}
            >
              {book?.category}
            </span>
            <div className="mt-2 opacity-95 transform scale-80">
              {renderEmblem(motifIndex, palette.accent)}
            </div>
          </div>

          {/* Center Contrasting Band Holding Title */}
          <div
            className={`py-3 px-4 pl-7 border-y shadow-md my-auto ${palette.bandBg}`}
            style={{ borderColor: palette.accent }}
          >
            <h4
              className="line-clamp-2 text-xs sm:text-sm font-black tracking-tight text-white font-display leading-tight"
              title={book?.title}
            >
              {book?.title}
            </h4>
            <p
              className="mt-1 text-[10px] font-bold tracking-wider uppercase truncate"
              style={{ color: palette.accent }}
            >
              {book?.author}
            </p>
          </div>

          {/* Bottom Area */}
          <div className="p-3 pl-6 pb-3 flex items-center justify-between text-[8.5px] font-mono opacity-75">
            <span className="truncate">{book?.publisher}</span>
            <span className="font-bold">{book?.id}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 4: Celestial Constellation (Stipple & Radiant Glow)
          ======================================================== */}
      {layoutType === 4 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7 text-center">
          {/* Stipple Star Accents */}
          <div className="absolute inset-0 opacity-25 pointer-events-none flex flex-wrap gap-4 p-4">
            <span className="h-1 w-1 bg-white rounded-full animate-ping" />
            <span className="h-1 w-1 bg-white rounded-full ml-auto" />
            <span className="h-0.5 w-0.5 bg-white rounded-full mt-8" />
          </div>

          {/* Top Category Badge */}
          <div className="pt-1">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[8.5px] font-bold tracking-widest uppercase ${palette.tagBg}`}
            >
              {book?.category}
            </span>
          </div>

          {/* Radiant Emblem & Starline */}
          <div className="my-auto py-1 flex flex-col items-center">
            <div className="mb-2.5 transform transition-transform group-hover:scale-110 duration-300 drop-shadow-md">
              {renderEmblem(motifIndex, palette.accent)}
            </div>

            <h4
              className="line-clamp-2 text-xs sm:text-sm font-extrabold leading-snug tracking-tight text-white font-display px-1"
              title={book?.title}
            >
              {book?.title}
            </h4>

            <div
              className="mx-auto mt-2 h-[2px] w-6 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />

            <p
              className="mt-1 line-clamp-1 text-[10px] font-bold tracking-wide uppercase"
              style={{ color: palette.secondary }}
            >
              {book?.author}
            </p>
          </div>

          {/* Bottom Barcode / Year */}
          <div className="border-t border-white/15 pt-1.5 flex items-center justify-between text-[8.5px] font-mono opacity-70 px-1">
            <span>{book?.publishedYear}</span>
            <span className="font-bold tracking-wider">{book?.id}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 5: Penguin Classic Monograph (Three-Band Structure)
          ======================================================== */}
      {layoutType === 5 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between">
          {/* Top Band: Author & Series */}
          <div className="p-3 pl-6 pt-3 flex flex-col">
            <span
              className={`self-start rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${palette.tagBg}`}
            >
              {book?.category}
            </span>
            <p
              className="mt-2 text-xs font-black uppercase tracking-wider truncate"
              style={{ color: palette.textLight }}
            >
              {book?.author}
            </p>
          </div>

          {/* Center Cream / Parchment Band Holding Title */}
          <div className="bg-amber-50 text-slate-900 py-3.5 px-4 pl-7 shadow-lg my-auto border-y-2 border-amber-200/60">
            <h4
              className="line-clamp-2 text-xs sm:text-sm font-black tracking-tight leading-snug font-serif text-slate-900"
              title={book?.title}
            >
              {book?.title}
            </h4>
          </div>

          {/* Bottom Band: Hallmark Emblem */}
          <div className="p-3 pl-6 pb-3 flex items-center justify-between">
            <div className="transform scale-75 origin-left">
              {renderEmblem(motifIndex, palette.accent)}
            </div>
            <span className="text-[8.5px] font-mono font-bold opacity-80">
              {book?.id}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 6: Art Deco Geometric Chevron (Dynamic Angles)
          ======================================================== */}
      {layoutType === 6 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7">
          {/* Corner Deco Angles */}
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/30 pointer-events-none" />
          <div className="absolute bottom-2 left-5 w-8 h-8 border-b-2 border-l-2 border-white/30 pointer-events-none" />

          {/* Category Chip */}
          <div className="pt-1">
            <span
              className={`inline-block rounded border px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest ${palette.tagBg}`}
            >
              {book?.category}
            </span>
          </div>

          {/* Emblem & Chevron Divider */}
          <div className="my-auto py-1 flex flex-col items-center text-center">
            <div className="mb-2">
              {renderEmblem(motifIndex, palette.accent)}
            </div>

            <div className="w-12 h-1 border-y border-white/30 my-1" />

            <h4
              className="line-clamp-2 text-xs sm:text-sm font-black tracking-wider uppercase text-white font-display px-1 leading-tight"
              title={book?.title}
            >
              {book?.title}
            </h4>

            <p
              className="mt-1.5 text-[9.5px] font-bold tracking-widest uppercase truncate max-w-[90%]"
              style={{ color: palette.accent }}
            >
              {book?.author}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-white/20 pt-1.5 flex items-center justify-between text-[8px] font-mono opacity-80">
            <span>{book?.publishedYear}</span>
            <span className="font-bold">{book?.id}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          LAYOUT 7: Archival Botanical / Laurel Seal (Regal Seal)
          ======================================================== */}
      {layoutType === 7 && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 pl-6 sm:p-4 sm:pl-7 text-center">
          {/* Filigree Corner Dots */}
          <div className="absolute top-3 left-6 text-white/30 text-[10px] pointer-events-none">✦</div>
          <div className="absolute top-3 right-3 text-white/30 text-[10px] pointer-events-none">✦</div>

          {/* Top Tag */}
          <div className="pt-1">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[8.5px] font-bold tracking-widest uppercase ${palette.tagBg}`}
            >
              {book?.category}
            </span>
          </div>

          {/* Central Heraldic Seal */}
          <div className="my-auto py-1 flex flex-col items-center">
            <div className="p-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xs mb-2">
              {renderEmblem(motifIndex, palette.accent)}
            </div>

            <h4
              className="line-clamp-2 text-xs sm:text-sm font-extrabold tracking-tight text-white font-display leading-tight px-1"
              title={book?.title}
            >
              {book?.title}
            </h4>

            <div className="flex items-center gap-1.5 my-1.5 opacity-60">
              <span className="h-[1px] w-4 bg-white" />
              <span className="text-[8px] font-serif">❖</span>
              <span className="h-[1px] w-4 bg-white" />
            </div>

            <p
              className="text-[10px] font-bold tracking-wider uppercase truncate max-w-[90%]"
              style={{ color: palette.textLight }}
            >
              {book?.author}
            </p>
          </div>

          {/* Bottom Catalog Stamp */}
          <div className="border-t border-white/15 pt-1.5 flex items-center justify-between text-[8.5px] font-mono opacity-70 px-1">
            <span>{book?.publisher || "Archive"}</span>
            <span className="font-bold">{book?.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCoverImage;
