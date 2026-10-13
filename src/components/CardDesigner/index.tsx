"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import type { Event } from "@/components/EventCard";
import {
  Section, SectionTitle, CardPreview, GlowOrb, CardCategory, CardTitle,
  CardDate, CardPrice, StickersLayer, FloatingSticker, StatusRow,
  SavingText, SavedText, HintText, SubLabel, ThemeGrid, ThemeBtn,
  StickerGrid, StickerBtn, ClearBtn,
} from "./style";

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

interface CardDesignerProps {
  event: Event;
}

export default function CardDesigner({ event }: CardDesignerProps) {
  const scTheme = useTheme();
  const THEMES = THEME_KEYS.map((t) => ({
    ...t,
    gradient: scTheme.gradients[t.key as keyof typeof scTheme.gradients],
  }));
  const { user, token } = useAuth();
  const [currentTheme, setCurrentTheme] = useState("aurora");
  const [stickers, setStickers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

      <StatusRow>
        {saving && <SavingText>Saving…</SavingText>}
        {saved  && <SavedText>✓ Design saved</SavedText>}
        {!user  && <HintText>Sign in to save your design.</HintText>}
      </StatusRow>

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
