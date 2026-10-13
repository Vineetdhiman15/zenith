"use client";
// src/components/CardDesigner.tsx — fully styled-components

import { useState, useEffect, useCallback } from "react";
import styled, { css, keyframes, useTheme } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import type { Event } from "./EventCard";

// ─── Sticker / static data ────────────────────────────────────────────────────
// THEMES are resolved at render time from the active theme via useTheme()
const THEME_KEYS = [
  { key: "aurora", label: "Aurora" },
  { key: "sunset", label: "Sunset" },
  { key: "ocean",  label: "Ocean"  },
];

const STICKERS = [
  { key: "star",   emoji: "⭐" },
  { key: "fire",   emoji: "🔥" },
  { key: "heart",  emoji: "❤️" },
  { key: "music",  emoji: "🎵" },
  { key: "rocket", emoji: "🚀" },
];

const MAX_STICKERS = 3;

// ─── Keyframes ────────────────────────────────────────────────────────────────
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

// ─── Styled components ────────────────────────────────────────────────────────
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* Live card preview */
const CardPreview = styled.div<{ $gradient: string }>`
  position: relative;
  border-radius: ${(p) => p.theme.radii.xl};
  background: ${(p) => p.$gradient};
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1.5rem;
  min-height: 11rem;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  transition: background ${(p) => p.theme.transitions.slow};
`;

const GlowOrb = styled.div`
  position: absolute;
  bottom: -2rem;
  right: -2rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  filter: blur(1.5rem);
  pointer-events: none;
`;

const CardCategory = styled.div<{ $glowColor?: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.375rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  line-height: 1.25;
  margin-bottom: 0.375rem;
`;

const CardDate = styled.p`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.375rem;
`;

const CardPrice = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

const StickersLayer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: flex-end;
  max-width: 5rem;
`;

const FloatingSticker = styled.span<{ $delay: number }>`
  font-size: 1.5rem;
  display: inline-block;
  animation: ${float} 2.5s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;
`;

/* Status row */
const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.25rem;
`;

const SavingText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const SavedText = styled.span`
  font-size: 0.75rem;
  color: #4ade80;
  animation: ${fadeIn} 0.3s ease-out;
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: #fbbf24;
`;

/* Sub-section label */
const SubLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mutedLight};
  margin-bottom: 0.75rem;
`;

/* Theme picker */
const ThemeGrid = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ThemeBtn = styled.button<{ $gradient: string; $active: boolean }>`
  flex: 1;
  height: 4rem;
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.$gradient};
  display: flex;
  align-items: flex-end;
  padding: 0.5rem 0.625rem;
  border: 2px solid ${(p) => (p.$active ? "rgba(255,255,255,0.9)" : "transparent")};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};
  opacity: ${(p) => (p.$active ? 1 : 0.55)};
  transform: ${(p) => (p.$active ? "scale(1.05)" : "scale(1)")};

  ${(p) =>
    p.$active &&
    css`
      box-shadow: ${(p) => p.theme.shadows.glow};
    `}

  &:hover:not([aria-pressed="true"]) {
    opacity: 0.85;
  }

  span {
    font-size: 0.7rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

/* Sticker picker */
const StickerGrid = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StickerBtn = styled.button<{ $selected: boolean; $maxed: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 1.5rem;
  border: 2px solid;
  cursor: ${(p) => (p.$maxed ? "not-allowed" : "pointer")};
  transition: all ${(p) => p.theme.transitions.normal};
  background: none;

  ${(p) =>
    p.$selected
      ? css`
          border-color: ${(p) => p.theme.colors.primary};
          background: rgba(124, 58, 237, 0.2);
          transform: scale(1.12);
          box-shadow: ${(p) => p.theme.shadows.glow};
        `
      : p.$maxed
      ? css`
          border-color: rgba(255, 255, 255, 0.06);
          opacity: 0.25;
        `
      : css`
          border-color: rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          &:hover { border-color: rgba(255,255,255,0.25); transform: scale(1.06); }
        `}
`;

const ClearBtn = styled.button`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover { color: ${(p) => p.theme.colors.mutedLight}; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface CardDesignerProps {
  event: Event;
}

export default function CardDesigner({ event }: CardDesignerProps) {
  const scTheme = useTheme(); // resolves current light/dark theme
  const THEMES = THEME_KEYS.map((t) => ({
    ...t,
    gradient: scTheme.gradients[t.key as keyof typeof scTheme.gradients],
  }));
  const { user, token } = useAuth();
  const [currentTheme, setCurrentTheme] = useState("aurora");
  const [stickers, setStickers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved design on mount
  useEffect(() => {
    if (!user || !token) return;
    fetch(`/api/user/card-design/${event.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.theme)    setCurrentTheme(d.theme);
        if (d.stickers) setStickers(d.stickers);
      })
      .catch(() => {});
  }, [event.id, user, token]);

  const save = useCallback(
    async (t: string, s: string[]) => {
      if (!user || !token) return;
      setSaving(true);
      try {
        await fetch(`/api/user/card-design/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ theme: t, stickers: s }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } finally {
        setSaving(false);
      }
    },
    [event.id, user, token]
  );

  const handleTheme = (key: string) => {
    setCurrentTheme(key);
    save(key, stickers);
  };

  const handleSticker = (key: string) => {
    setStickers((prev) => {
      let next: string[];
      if (prev.includes(key)) {
        next = prev.filter((s) => s !== key);
      } else if (prev.length < MAX_STICKERS) {
        next = [...prev, key];
      } else {
        return prev;
      }
      save(currentTheme, next);
      return next;
    });
  };

  const activeTheme = THEMES.find((t) => t.key === currentTheme) ?? THEMES[0];

  return (
    <Section>
      <SectionTitle>🎨 Design Your Card</SectionTitle>

      {/* Live preview */}
      <CardPreview $gradient={activeTheme.gradient}>
        <GlowOrb />
        {stickers.length > 0 && (
          <StickersLayer>
            {stickers.map((key, i) => {
              const s = STICKERS.find((x) => x.key === key);
              return s ? (
                <FloatingSticker key={key} $delay={i * 0.25}>{s.emoji}</FloatingSticker>
              ) : null;
            })}
          </StickersLayer>
        )}
        <CardCategory>{event.category} · {event.city}</CardCategory>
        <CardTitle>{event.title}</CardTitle>
        <CardDate>{formatFriendlyDate(event.date_time)}</CardDate>
        <CardPrice>{formatIndianCurrency(event.price)}</CardPrice>
      </CardPreview>

      {/* Save status */}
      <StatusRow>
        {saving && <SavingText>Saving…</SavingText>}
        {saved  && <SavedText>✓ Design saved</SavedText>}
        {!user  && <HintText>Sign in to save your design.</HintText>}
      </StatusRow>

      {/* Theme picker */}
      <div>
        <SubLabel>Background Theme</SubLabel>
        <ThemeGrid>
          {THEMES.map((t) => (
            <ThemeBtn
              key={t.key}
              $gradient={t.gradient}
              $active={currentTheme === t.key}
              aria-label={`Theme: ${t.label}`}
              aria-pressed={currentTheme === t.key}
              onClick={() => handleTheme(t.key)}
            >
              <span>{t.label}</span>
            </ThemeBtn>
          ))}
        </ThemeGrid>
      </div>

      {/* Sticker picker */}
      <div>
        <SubLabel>
          Stickers{" "}
          <span style={{ color: "#64748b", fontWeight: 400 }}>
            ({stickers.length}/{MAX_STICKERS})
          </span>
        </SubLabel>
        <StickerGrid>
          {STICKERS.map((s) => {
            const selected = stickers.includes(s.key);
            const maxed    = stickers.length >= MAX_STICKERS && !selected;
            return (
              <StickerBtn
                key={s.key}
                $selected={selected}
                $maxed={maxed}
                disabled={maxed}
                onClick={() => handleSticker(s.key)}
                aria-label={`Sticker: ${s.key}`}
                aria-pressed={selected}
              >
                {s.emoji}
              </StickerBtn>
            );
          })}
        </StickerGrid>
        {stickers.length > 0 && (
          <ClearBtn onClick={() => { setStickers([]); save(currentTheme, []); }}>
            Clear stickers
          </ClearBtn>
        )}
      </div>
    </Section>
  );
}
