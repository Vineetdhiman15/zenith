// src/styles/theme.ts
// Design tokens for light (default) and dark themes.
// The active theme is injected via styled-components ThemeProvider.

const shared = {
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
};

export const lightTheme = {
  ...shared,
  mode: "light" as const,
  colors: {
    bg:          "#f5f6fa",
    surface:     "#ffffff",
    surfaceHigh: "#f0f1f5",
    border:      "rgba(0, 0, 0, 0.08)",
    text:        "#1e1e2e",
    textSecondary: "#374151",
    muted:       "#6b7280",
    mutedLight:  "#4b5563",
    primary:     "#7c3aed",
    primary2:    "#a855f7",
    primaryFaded: "rgba(124, 58, 237, 0.08)",
    success:     "#16a34a",
    danger:      "#dc2626",
    warning:     "#d97706",
    cardHover:   "rgba(124, 58, 237, 0.06)",
    inputBg:     "#f9fafb",
    inputBorder: "rgba(0, 0, 0, 0.12)",
    navBg:       "rgba(255, 255, 255, 0.85)",
    navBorder:   "rgba(0, 0, 0, 0.06)",
    badgeActiveBg:     "rgba(22, 163, 74, 0.10)",
    badgeActiveColor:  "#16a34a",
    badgeActiveBorder: "rgba(22, 163, 74, 0.25)",
    badgeInactiveBg:     "rgba(220, 38, 38, 0.08)",
    badgeInactiveColor:  "#dc2626",
    badgeInactiveBorder: "rgba(220, 38, 38, 0.25)",
    skeleton1:   "rgba(0, 0, 0, 0.04)",
    skeleton2:   "rgba(0, 0, 0, 0.08)",
    overlay:     "rgba(255, 255, 255, 0.5)",
    scrollThumb: "rgba(124, 58, 237, 0.3)",
    ghostBg:     "rgba(0, 0, 0, 0.04)",
    ghostHoverBg:"rgba(0, 0, 0, 0.08)",
    white:       "#ffffff",
  },
  gradients: {
    primary: "linear-gradient(135deg, #7c3aed, #a855f7)",
    text:    "linear-gradient(135deg, #7c3aed, #c026d3)",
    bg:      "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.06), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(168,85,247,0.04), transparent)",
    aurora:  "linear-gradient(135deg, #ede9fe, #ddd6fe, #e0e7ff)",
    sunset:  "linear-gradient(135deg, #fce7f3, #fecdd3, #fee2e2)",
    ocean:   "linear-gradient(135deg, #ccfbf1, #cffafe, #dbeafe)",
  },
  shadows: {
    glow:    "0 0 20px rgba(124, 58, 237, 0.20)",
    card:    "0 12px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(124, 58, 237, 0.12)",
    btn:     "0 8px 24px rgba(124, 58, 237, 0.25)",
    surface: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  },
};

export const darkTheme = {
  ...shared,
  mode: "dark" as const,
  colors: {
    bg:          "#0a0a14",
    surface:     "#111122",
    surfaceHigh: "#1a1a2e",
    border:      "rgba(255, 255, 255, 0.08)",
    text:        "#e2e8f0",
    textSecondary: "#cbd5e1",
    muted:       "#64748b",
    mutedLight:  "#94a3b8",
    primary:     "#7c3aed",
    primary2:    "#a855f7",
    primaryFaded: "rgba(124, 58, 237, 0.15)",
    success:     "#4ade80",
    danger:      "#f87171",
    warning:     "#fbbf24",
    cardHover:   "rgba(124, 58, 237, 0.15)",
    inputBg:     "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(255, 255, 255, 0.10)",
    navBg:       "rgba(10, 10, 20, 0.8)",
    navBorder:   "rgba(255, 255, 255, 0.08)",
    badgeActiveBg:     "rgba(34, 197, 94, 0.15)",
    badgeActiveColor:  "#4ade80",
    badgeActiveBorder: "rgba(34, 197, 94, 0.3)",
    badgeInactiveBg:     "rgba(239, 68, 68, 0.15)",
    badgeInactiveColor:  "#f87171",
    badgeInactiveBorder: "rgba(239, 68, 68, 0.3)",
    skeleton1:   "rgba(255, 255, 255, 0.04)",
    skeleton2:   "rgba(255, 255, 255, 0.08)",
    overlay:     "rgba(10, 10, 20, 0.5)",
    scrollThumb: "rgba(124, 58, 237, 0.4)",
    ghostBg:     "rgba(255, 255, 255, 0.05)",
    ghostHoverBg:"rgba(255, 255, 255, 0.10)",
    white:       "#ffffff",
  },
  gradients: {
    primary: "linear-gradient(135deg, #7c3aed, #a855f7)",
    text:    "linear-gradient(135deg, #a78bfa, #f0abfc)",
    bg:      "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.20), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(168,85,247,0.08), transparent)",
    aurora:  "linear-gradient(135deg, #1e0a3c, #2d1b69, #1e1b4b)",
    sunset:  "linear-gradient(135deg, #4a1942, #7c1d2d, #4c0519)",
    ocean:   "linear-gradient(135deg, #042f2e, #0c4a6e, #1e3a5f)",
  },
  shadows: {
    glow:    "0 0 20px rgba(124, 58, 237, 0.35)",
    card:    "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(124, 58, 237, 0.3)",
    btn:     "0 8px 24px rgba(124, 58, 237, 0.4)",
    surface: "none",
  },
};

export type AppTheme = typeof lightTheme;

// Re-export default for components that need a static reference (rare)
export const theme = lightTheme;
