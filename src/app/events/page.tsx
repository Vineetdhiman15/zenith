"use client";
// src/app/events/page.tsx — styled-components

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import EventCard, { Event } from "@/components/EventCard";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  PageHeader, PageTitle, PageWrapper,
  GlassPanel, Skeleton, EventGrid,
  PrimaryButton, CenteredContent,
} from "@/styles/shared";

// ─── Styled components ────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled.div<{ $delay: number }>`
  animation: ${fadeInUp} 0.4s ease-out both;
  animation-delay: ${(p) => p.$delay}s;
`;

const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9375rem;
  margin-top: 0.5rem;
`;

const FilterWrapper = styled(GlassPanel)`
  padding: 1rem;
  margin-bottom: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 1.5rem;
`;

const SkeletonCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  overflow: hidden;
`;

const SkeletonBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// ─── Inner content ────────────────────────────────────────────────────────────
function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal]   = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [reminderIds, setReminderIds] = useState<Set<number>>(new Set());

  const category = searchParams.get("category") || "";
  const city     = searchParams.get("city")     || "";
  const search   = searchParams.get("search")   || "";
  const page     = parseInt(searchParams.get("page") || "1", 10);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) current.set(k, v); else current.delete(k);
      });
      if (!("page" in updates)) current.set("page", "1");
      router.push(`/events?${current.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (v: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateParams({ search: v }), 400);
    },
    [updateParams]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams({ category, city, search, page: page.toString() });
        const res = await fetch(`/api/events?${qs}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEvents(data.events);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        setError("Could not load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, city, search, page]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/reminders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setReminderIds(new Set(d.eventIds)))
      .catch(() => {});
  }, [token]);

  return (
    <>
      <PageHeader>
        <PageTitle>Upcoming Events</PageTitle>
        <Subtitle>{!loading && `${total} event${total !== 1 ? "s" : ""} found`}</Subtitle>
      </PageHeader>

      <PageWrapper style={{ paddingTop: 0 }}>
        <FilterWrapper>
          <FilterBar
            category={category} city={city} search={search}
            onCategoryChange={(v) => updateParams({ category: v })}
            onCityChange={(v)     => updateParams({ city: v })}
            onSearchChange={handleSearchChange}
          />
        </FilterWrapper>

        {/* Loading skeletons */}
        {loading && (
          <EventGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <Skeleton $height="11rem" style={{ borderRadius: 0 }} />
                <SkeletonBody>
                  <Skeleton $height="1.1rem" $width="75%" />
                  <Skeleton $height="0.875rem" $width="55%" />
                  <Skeleton $height="0.875rem" />
                </SkeletonBody>
              </SkeletonCard>
            ))}
          </EventGrid>
        )}

        {/* Error */}
        {!loading && error && (
          <GlassPanel style={{ padding: "3rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>⚠️</EmptyIcon>
              <EmptyText>{error}</EmptyText>
              <PrimaryButton onClick={() => window.location.reload()}>Retry</PrimaryButton>
            </CenteredContent>
          </GlassPanel>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <GlassPanel style={{ padding: "4rem 2rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No events found</EmptyTitle>
              <EmptyText>Try adjusting your filters or check back later for new events.</EmptyText>
              <PrimaryButton onClick={() => router.push("/events")}>Clear filters</PrimaryButton>
            </CenteredContent>
          </GlassPanel>
        )}

        {/* Grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <EventGrid>
              {events.map((event, i) => (
                <AnimatedCard key={event.id} $delay={i * 0.05}>
                  <EventCard event={event} initialReminded={reminderIds.has(event.id)} />
                </AnimatedCard>
              ))}
            </EventGrid>
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: p.toString() })} />
          </>
        )}
      </PageWrapper>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <PageHeader>
          <Skeleton $height="2.5rem" $width="16rem" style={{ margin: "0 auto" }} />
        </PageHeader>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
