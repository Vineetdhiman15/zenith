"use client";
// src/components/ClientShell.tsx
// Client component that mounts GlobalStyles, AuthProvider, and the Navbar.
// Kept separate from layout.tsx (Server Component) so we can use hooks.

import GlobalStyles from "@/styles/GlobalStyles";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GlobalStyles />
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
