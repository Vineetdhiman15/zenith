"use client";
// src/app/events/[id]/page.tsx — styled-components

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import type { Event } from "@/components/EventCard";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import CardDesigner from "@/components/CardDesigner";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";
import {
  PageWrapper, GlassPanel, Skeleton,
  PrimaryButton, GhostButton, Toast, CenteredContent,
} from "@/styles/shared";

// ─── Styled components ────────────────────────────────────────────────────────
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color ${theme.transitions.fast};

  &:hover { color: white; }
`;

const HeroImage = styled.div`
  position: relative;
  height: 18rem;
  border-radius: ${theme.radii.xl};
  overflow: hidden;
  margin-bottom: 2rem;

  @media (min-width: ${theme.breakpoints.sm}) { height: 24rem; }
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.2) 50%, transparent 100%);
`;

const HeroCategoryBadge = styled.span`
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${theme.radii.full};
  background: rgba(124,58,237,0.7);
  color: white;
  backdrop-filter: blur(8px);
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: ${theme.breakpoints.md}) { grid-template-columns: 2fr 1fr; }
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 0.75rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: ${theme.colors.muted};
  font-size: 0.875rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const AboutPanel = styled(GlassPanel)`
  padding: 1.25rem;
  margin-top: 1.25rem;
`;

const AboutLabel = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: ${theme.colors.muted};
  margin-bottom: 0.75rem;
`;

const AboutText = styled.p`
  color: ${theme.colors.mutedLight};
  line-height: 1.75;
  font-size: 0.9375rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PricePanel = styled(GlassPanel)`
  padding: 1.25rem;
  text-align: center;
`;

const PriceLabel = styled.p`
  font-size: 0.8125rem;
  color: ${theme.colors.muted};
  margin-bottom: 0.25rem;
`;

const PriceValue = styled.p`
  font-size: 2rem;
  font-weight: 800;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ReminderBtn = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.875rem;
  border-radius: ${theme.radii.lg};
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: ${theme.fonts.body};
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  ${(p) =>
    p.$active
      ? `background: ${theme.colors.primary}; color: white; box-shadow: ${theme.shadows.glow};`
      : `background: rgba(255,255,255,0.05); color: ${theme.colors.mutedLight}; border: 1px solid ${theme.colors.border};`}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

const DesignerPanel = styled(GlassPanel)`
  padding: 1.5rem;
  margin-top: 2.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const CATEGORY_ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [event, setEvent]     = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [reminded, setReminded]           = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);
  const [toastMsg, setToastMsg]             = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.event) setEvent(d.event); else setError("Event not found"); })
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/reminders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setReminded(d.eventIds?.includes(Number(id)) ?? false))
      .catch(() => {});
  }, [token, id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReminder = async () => {
    if (!user) { showToast("Please sign in to set reminders"); return; }
    setSavingReminder(true);
    const next = !reminded;
    setReminded(next);
    try {
      const res = next
        ? await fetch("/api/user/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ eventId: Number(id) }),
          })
        : await fetch(`/api/user/reminders/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
      if (!res.ok) throw new Error();
      showToast(next ? "Reminder set! 🔔" : "Reminder removed");
    } catch {
      setReminded(!next);
      showToast("Failed to save. Please try again.");
    } finally {
      setSavingReminder(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper style={{ maxWidth: "56rem" }}>
        <Skeleton $height="1.5rem" $width="8rem" style={{ marginBottom: "1.5rem" }} />
        <Skeleton $height="24rem" style={{ borderRadius: theme.radii.xl, marginBottom: "2rem" }} />
        <Skeleton $height="2rem"  $width="60%" style={{ marginBottom: "1rem" }} />
        <Skeleton $height="1rem"  $width="40%" style={{ marginBottom: "0.5rem" }} />
        <Skeleton $height="1rem" />
      </PageWrapper>
    );
  }

  if (error || !event) {
    return (
      <PageWrapper style={{ maxWidth: "56rem" }}>
        <CenteredContent>
          <EmptyIcon>😕</EmptyIcon>
          <p style={{ color: theme.colors.muted }}>{error || "Event not found"}</p>
        </CenteredContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper style={{ maxWidth: "56rem" }}>
      {toastMsg && <Toast>{toastMsg}</Toast>}

      <BackLink href="/events">← Back to events</BackLink>

      {event.image_url && (
        <HeroImage>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <HeroImg src={event.image_url} alt={event.title} />
          <HeroOverlay />
          <HeroCategoryBadge>
            {CATEGORY_ICONS[event.category]} {event.category}
          </HeroCategoryBadge>
        </HeroImage>
      )}

      <Grid>
        {/* Left */}
        <div>
          <Title>{event.title}</Title>
          <MetaRow>
            <MetaItem>📅 {formatFriendlyDate(event.date_time)}</MetaItem>
            <MetaItem>📍 {event.city}</MetaItem>
          </MetaRow>
          <AboutPanel>
            <AboutLabel>About this event</AboutLabel>
            <AboutText>{event.description}</AboutText>
          </AboutPanel>
        </div>

        {/* Sidebar */}
        <Sidebar>
          <PricePanel>
            <PriceLabel>Price</PriceLabel>
            <PriceValue>{formatIndianCurrency(event.price)}</PriceValue>
          </PricePanel>

          <ReminderBtn
            $active={reminded}
            disabled={savingReminder}
            onClick={handleReminder}
          >
            {reminded ? "🔔 Reminder Set" : "🔕 Remind Me"}
          </ReminderBtn>
        </Sidebar>
      </Grid>

      {/* Card Designer */}
      <DesignerPanel>
        <CardDesigner event={event} />
      </DesignerPanel>
    </PageWrapper>
  );
}
