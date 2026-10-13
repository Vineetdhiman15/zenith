"use client";
// src/components/ClientShell.tsx
// Client component that mounts ThemeProvider, GlobalStyles, AuthProvider, and the Navbar.

import React from "react";
import GlobalStyles from "@/styles/GlobalStyles";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <AuthProvider>
        <Navbar />
        <main>{children}</main>
      </AuthProvider>
    </ThemeProvider>
  );
}
