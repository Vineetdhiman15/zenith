"use client";
// src/components/EventCard.tsx — fully theme-aware styled-components

import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { useState, useEffect, useOptimistic, startTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";

export interface Event {
  id: number;
  title: string;
  category: string;
  city: string;
  date_time: string;
  price: number;
  description: string;
  image_url: string;
  is_active: number;
}

// ─── Category colour maps ─────────────────────────────────────────────────────
const CATEGORY_BG: Record<string, string> = {
  Music:    "rgba(124,58,237,0.18)",
  Workshop: "rgba(245,158,11,0.18)",
  Food:     "rgba(249,115,22,0.18)",
  Sports:   "rgba(34,197,94,0.18)",
  Kids:     "rgba(236,72,153,0.18)",
};
const CATEGORY_COLOR: Record<string, string> = {
  Music:    "#a78bfa",
  Workshop: "#fbbf24",
  Food:     "#fb923c",
  Sports:   "#4ade80",
  Kids:     "#f472b6",
};
const CATEGORY_BORDER: Record<string, string> = {
  Music:    "rgba(124,58,237,0.35)",
  Workshop: "rgba(245,158,11,0.35)",
  Food:     "rgba(249,115,22,0.35)",
  Sports:   "rgba(34,197,94,0.35)",
  Kids:     "rgba(236,72,153,0.35)",
};
const CATEGORY_ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeInDown = keyframes`
  from { opacity: 0; transform: translate(-50%, -4px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

// ─── Styled components ────────────────────────────────────────────────────────
const Card = styled.article`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition:
    transform ${(p) => p.theme.transitions.normal},
    box-shadow ${(p) => p.theme.transitions.normal},
    border-color ${(p) => p.theme.transitions.normal},
    background-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(p) => p.theme.shadows.card};
    border-color: rgba(124, 58, 237, 0.4);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 11rem;
  overflow: hidden;
  background: ${(p) =>
    (p.theme.mode as string) === "dark"
      ? "linear-gradient(135deg, #2d1b69, #1e1b4b)"
      : "linear-gradient(135deg, #ede9fe, #ddd6fe)"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${(p) => p.theme.transitions.slow};

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${(p) =>
    (p.theme.mode as string) === "dark"
      ? "linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 60%)"
      : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)"};
`;

const CategoryBadge = styled.span<{ $cat: string }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: ${(p) => p.theme.radii.full};
  backdrop-filter: blur(8px);
  border: 1px solid;
  background: ${(p) => CATEGORY_BG[p.$cat] ?? "rgba(100,116,139,0.2)"};
  color:      ${(p) => CATEGORY_COLOR[p.$cat]  ?? "#94a3b8"};
  border-color: ${(p) => CATEGORY_BORDER[p.$cat] ?? "rgba(100,116,139,0.3)"};
`;

const PriceBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: ${(p) => p.theme.radii.full};
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.65);
  color: white;
`;

const FallbackIcon = styled.span`
  font-size: 3rem;
`;

const Body = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};

  svg { color: #8b5cf6; flex-shrink: 0; }
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionLink = styled(Link)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(p) => p.theme.colors.ghostBg};
  color: ${(p) => p.theme.colors.mutedLight};
  border: 1px solid ${(p) => p.theme.colors.border};
  text-decoration: none;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover { background: ${(p) => p.theme.colors.ghostHoverBg}; color: ${(p) => p.theme.colors.text}; }
`;

const ReminderBtn = styled.button<{ $active: boolean; $saving: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: ${(p) => (p.$saving ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$saving ? 0.6 : 1)};
  transition: all ${(p) => p.theme.transitions.normal};

  ${(p) =>
    p.$active
      ? css`
          background: ${p.theme.colors.primary};
          color: white;
          box-shadow: ${p.theme.shadows.glow};
        `
      : css`
          background: ${p.theme.colors.ghostBg};
          color: ${p.theme.colors.muted};
          border: 1px solid ${p.theme.colors.border};
          &:hover { background: ${p.theme.colors.ghostHoverBg}; color: ${p.theme.colors.text}; }
        `}
`;

const ReminderLabel = styled.span`
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) { display: none; }
`;

const InlineToast = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-size: 0.7rem;
  padding: 0.375rem 0.75rem;
  border-radius: ${(p) => p.theme.radii.full};
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  border: 1px solid rgba(124,58,237,0.3);
  animation: ${fadeInDown} 0.25s ease-out;
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface EventCardProps {
  event: Event;
  initialReminded?: boolean;
}

export default function EventCard({ event, initialReminded = false }: EventCardProps) {
  const { user, token } = useAuth();
  const [reminded, setReminded] = useState(initialReminded);
  const [savingReminder, setSavingReminder] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [optimisticReminded, setOptimisticReminded] = useOptimistic(reminded);

  useEffect(() => { setReminded(initialReminded); }, [initialReminded]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReminder = async () => {
    if (!user) { showToast("Please sign in to set reminders"); return; }
    if (savingReminder) return;
    setSavingReminder(true);
    const next = !reminded;

    startTransition(() => setOptimisticReminded(next));

    try {
      const res = next
        ? await fetch("/api/user/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ eventId: event.id }),
          })
        : await fetch(`/api/user/reminders/${event.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

      if (res.ok) {
        setReminded(next);
        showToast(next ? "Reminder set! 🔔" : "Reminder removed");
      } else {
        startTransition(() => setOptimisticReminded(reminded));
        showToast("Failed to save. Please try again.");
      }
    } catch {
      startTransition(() => setOptimisticReminded(reminded));
      showToast("Failed to save. Please try again.");
    } finally {
      setSavingReminder(false);
    }
  };

  const icon = CATEGORY_ICONS[event.category] ?? "📅";

  return (
    <Card>
      {toastMsg && <InlineToast>{toastMsg}</InlineToast>}

      <ImageWrapper>
        {event.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <CardImage src={event.image_url} alt={event.title} />
        ) : (
          <FallbackIcon>{icon}</FallbackIcon>
        )}
        <ImageOverlay />
        <CategoryBadge $cat={event.category}>{icon} {event.category}</CategoryBadge>
        <PriceBadge>{formatIndianCurrency(event.price)}</PriceBadge>
      </ImageWrapper>

      <Body>
        <Title>{event.title}</Title>

        <MetaRow>
          <MetaItem>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatFriendlyDate(event.date_time)}
          </MetaItem>
          <MetaItem>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.city}
          </MetaItem>
        </MetaRow>

        <Description>{event.description}</Description>

        <Actions>
          <ActionLink href={`/events/${event.id}`}>View Details</ActionLink>
          <ReminderBtn
            $active={optimisticReminded}
            $saving={savingReminder}
            onClick={handleReminder}
            disabled={savingReminder}
            aria-label={optimisticReminded ? "Remove reminder" : "Set reminder"}
          >
            <span>{optimisticReminded ? "🔔" : "🔕"}</span>
            <ReminderLabel>{optimisticReminded ? "Reminded" : "Remind me"}</ReminderLabel>
          </ReminderBtn>
        </Actions>
      </Body>
    </Card>
  );
}
