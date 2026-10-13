// src/styles/theme.ts
// Single source of truth for all design tokens.
// Import this wherever styled-components are used.

export const theme = {
  colors: {
    bg:          "#0a0a14",
    surface:     "#111122",
    surfaceHigh: "#1a1a2e",
    border:      "rgba(255,255,255,0.08)",
    text:        "#e2e8f0",
    muted:       "#64748b",
    mutedLight:  "#94a3b8",
    primary:     "#7c3aed",
    primary2:    "#a855f7",
    success:     "#4ade80",
    danger:      "#f87171",
    warning:     "#fbbf24",
  },
  gradients: {
    primary:    "linear-gradient(135deg, #7c3aed, #a855f7)",
    text:       "linear-gradient(135deg, #a78bfa, #f0abfc)",
    bg:         "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.20), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(168,85,247,0.08), transparent)",
    aurora:     "linear-gradient(135deg, #1e0a3c, #2d1b69, #1e1b4b)",
    sunset:     "linear-gradient(135deg, #4a1942, #7c1d2d, #4c0519)",
    ocean:      "linear-gradient(135deg, #042f2e, #0c4a6e, #1e3a5f)",
  },
  shadows: {
    glow:    "0 0 20px rgba(124,58,237,0.35)",
    card:    "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.3)",
    btn:     "0 8px 24px rgba(124,58,237,0.4)",
  },
  radii: {
    sm:   "0.5rem",
    md:   "0.625rem",
    lg:   "1rem",
    xl:   "1.25rem",
    full: "9999px",
  },
  fonts: {
    body: "'Inter', system-ui, sans-serif",
  },
  transitions: {
    fast:   "0.15s ease",
    normal: "0.25s ease",
    slow:   "0.5s ease",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

export type Theme = typeof theme;
