// src/styles/GlobalStyles.ts
// Global styles using createGlobalStyle — theme is injected automatically via ThemeProvider.

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${(p) => p.theme.fonts.body};
    background-color: ${(p) => p.theme.colors.bg};
    color: ${(p) => p.theme.colors.text};
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;

    &::before {
      content: "";
      position: fixed;
      inset: 0;
      background: ${(p) => p.theme.gradients.bg};
      pointer-events: none;
      z-index: -1;
      transition: background 0.3s ease;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input, select, textarea {
    font-family: inherit;
    outline: none;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.scrollThumb};
    border-radius: 9999px;
  }

  /* Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  @keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default GlobalStyles;
