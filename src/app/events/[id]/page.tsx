"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Event } from "@/components/EventCard";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import CardDesigner from "@/components/CardDesigner";
import { useAuth } from "@/context/AuthContext";
import {
  PageWrapper, Skeleton, Toast, CenteredContent,
} from "@/styles/shared";
import {
  BackLink, HeroImage, HeroImg, HeroOverlay, HeroCategoryBadge, Grid, Title,
  MetaRow, MetaItem, AboutPanel, AboutLabel, AboutText, Sidebar, PricePanel,
  PriceLabel, PriceValue, ReminderBtn, DesignerPanel, EmptyIcon,
} from "./style";

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
        <Skeleton $height="24rem" style={{ borderRadius: "1.25rem", marginBottom: "2rem" }} />
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
          <p style={{ color: "#64748b" }}>{error || "Event not found"}</p>
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
