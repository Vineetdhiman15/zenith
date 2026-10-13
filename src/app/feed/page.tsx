"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import EventCard, { Event } from "@/components/EventCard";
import {
  PageHeader, PageTitle, PageWrapper,
  GlassPanel, Skeleton, EventGrid,
  PrimaryButton, CenteredContent,
} from "@/styles/shared";
import {
  AnimatedCard, CatChips, CatChip, EmptyIcon, EmptyTitle, EmptyText,
  SkeletonCard, SkeletonBody,
} from "./style";

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [events, setEvents]         = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [reminderIds, setReminderIds] = useState<Set<number>>(new Set());
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    if (user.role === "admin") { router.push("/admin/dashboard"); return; }

    Promise.all([
      fetch("/api/user/feed",      { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/user/reminders", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([feedData, remData]) => {
        setEvents(feedData.events ?? []);
        setCategories(feedData.categories ?? []);
        setReminderIds(new Set(remData.eventIds ?? []));
      })
      .catch(() => setError("Could not load your feed."))
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <Skeleton $height="2.5rem" $width="12rem" style={{ margin: "2rem auto 3rem" }} />
        <EventGrid>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i}>
              <Skeleton $height="11rem" style={{ borderRadius: 0 }} />
              <SkeletonBody>
                <Skeleton $height="1.1rem" $width="75%" />
                <Skeleton $height="0.875rem" $width="50%" />
              </SkeletonBody>
            </SkeletonCard>
          ))}
        </EventGrid>
      </PageWrapper>
    );
  }

  return (
    <>
      <PageHeader>
        <PageTitle>My Feed</PageTitle>
        {categories.length > 0 && (
          <CatChips>
            {categories.map((cat) => <CatChip key={cat}>{cat}</CatChip>)}
          </CatChips>
        )}
      </PageHeader>

      <PageWrapper style={{ paddingTop: 0 }}>
        {error && (
          <GlassPanel style={{ padding: "3rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyText>{error}</EmptyText>
            </CenteredContent>
          </GlassPanel>
        )}

        {!error && categories.length === 0 && (
          <GlassPanel style={{ padding: "4rem 2rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>🎯</EmptyIcon>
              <EmptyTitle>No favourite categories yet</EmptyTitle>
              <EmptyText>Pick the event types you love and we&apos;ll show them here.</EmptyText>
              <Link href="/auth/signup">
                <PrimaryButton>Pick Categories</PrimaryButton>
              </Link>
            </CenteredContent>
          </GlassPanel>
        )}

        {!error && categories.length > 0 && events.length === 0 && (
          <GlassPanel style={{ padding: "4rem 2rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>🔭</EmptyIcon>
              <EmptyTitle>No upcoming events in your feed</EmptyTitle>
              <EmptyText>
                No events in {categories.join(", ")} right now. Check back soon!
              </EmptyText>
              <Link href="/events">
                <PrimaryButton>Browse all events</PrimaryButton>
              </Link>
            </CenteredContent>
          </GlassPanel>
        )}

        {!error && events.length > 0 && (
          <EventGrid>
            {events.map((event, i) => (
              <AnimatedCard key={event.id} $delay={i * 0.05}>
                <EventCard event={event} initialReminded={reminderIds.has(event.id)} />
              </AnimatedCard>
            ))}
          </EventGrid>
        )}
      </PageWrapper>
    </>
  );
}
