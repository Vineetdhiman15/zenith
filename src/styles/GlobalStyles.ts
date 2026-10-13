// src/styles/GlobalStyles.ts
// Global CSS reset and base styles using styled-components createGlobalStyle.

import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

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
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.bg};
    color: ${theme.colors.text};
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &::before {
      content: "";
      position: fixed;
      inset: 0;
      background: ${theme.gradients.bg};
      pointer-events: none;
      z-index: -1;
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
    background: rgba(124,58,237,0.4);
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
