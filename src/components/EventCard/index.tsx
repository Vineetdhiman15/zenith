"use client";

import { useState, useEffect, useOptimistic, startTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import {
  Card, ImageWrapper, CardImage, ImageOverlay, CategoryBadge, PriceBadge,
  FallbackIcon, Body, Title, MetaRow, MetaItem, Description, Actions,
  ActionLink, ReminderBtn, ReminderLabel, InlineToast,
} from "./style";

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

const CATEGORY_ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

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
