"use client";
// src/app/settings/categories/page.tsx
// Lets logged-in visitors update their favourite categories at any time.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled, { css } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";
import {
  PageWrapper, GlassPanel, PrimaryButton,
  SuccessBox, ErrorBox,
} from "@/styles/shared";

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Styled components ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: calc(100dvh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const Card = styled(GlassPanel)`
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
  p  { font-size: 0.875rem; color: ${theme.colors.muted}; }
`;

const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CatBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: ${theme.radii.lg};
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: ${theme.fonts.body};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  border: 2px solid;

  ${(p) =>
    p.$selected
      ? css`
          border-color: ${theme.colors.primary};
          background: rgba(124, 58, 237, 0.2);
          color: white;
          box-shadow: ${theme.shadows.glow};
          transform: scale(1.02);
        `
      : css`
          border-color: ${theme.colors.border};
          background: rgba(255, 255, 255, 0.04);
          color: ${theme.colors.mutedLight};
          &:hover { border-color: rgba(255,255,255,0.2); color: white; }
        `}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoriesSettingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }

    // Load existing favourites
    fetch("/api/user/favourites", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setSelected(d.categories ?? []))
      .catch(() => {});
  }, [user, token, authLoading, router]);

  const toggle = (cat: string) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSave = async () => {
    setError(""); setSuccess("");
    setSaving(true);
    const res = await fetch("/api/user/favourites", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categories: selected }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess("Preferences saved! Your feed has been updated.");
      setTimeout(() => router.push("/feed"), 1500);
    } else {
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
    <Page>
      <Card>
        <Heading>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
          <h1>Your Interests</h1>
          <p>Choose the event types you want in your feed.</p>
        </Heading>

        <CatGrid>
          {CATEGORIES.map((cat) => (
            <CatBtn
              key={cat}
              $selected={selected.includes(cat)}
              onClick={() => toggle(cat)}
              aria-pressed={selected.includes(cat)}
            >
              <span style={{ fontSize: "1.25rem" }}>{ICONS[cat]}</span>
              {cat}
            </CatBtn>
          ))}
        </CatGrid>

        {success && <SuccessBox style={{ marginBottom: "1rem" }}>{success}</SuccessBox>}
        {error   && <ErrorBox   style={{ marginBottom: "1rem" }}>{error}</ErrorBox>}

        <PrimaryButton
          style={{ width: "100%", padding: "0.75rem" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Preferences →"}
        </PrimaryButton>
      </Card>
    </Page>
  );
}
