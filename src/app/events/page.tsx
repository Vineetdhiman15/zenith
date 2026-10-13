"use client";
// src/app/events/page.tsx — styled-components

import { useState, useEffect, useRef, Suspense } from "react";
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
  min-height: 1.4rem; /* reserve space so header never shifts */
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
  color: ${(p) => p.theme.colors.text};
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

// Grid wrapper that fades out while loading NEW results (keeps layout stable)
const GridWrapper = styled.div<{ $loading: boolean }>`
  opacity: ${(p) => (p.$loading ? 0.45 : 1)};
  transition: opacity 0.2s ease;
  pointer-events: ${(p) => (p.$loading ? "none" : "auto")};
`;

// Tiny spinner shown in the subtitle area while fetching
const Spinner = styled.span`
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid ${(p) => p.theme.colors.primary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 0.5rem;
  vertical-align: middle;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;

function EventsContent() {
  const { token } = useAuth();

  // All filter state is LOCAL — never touches the URL, never triggers navigation
  const [category, setCategory] = useState("");
  const [city,     setCity]     = useState("");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);

  const [events,     setEvents]     = useState<Event[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [firstLoad,  setFirstLoad]  = useState(true); // show skeletons only on very first load
  const [error,      setError]      = useState("");
  const [reminderIds, setReminderIds] = useState<Set<number>>(new Set());

  // Debounced search value — only changes 400ms after the user stops typing
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update debounced search after 400ms of no typing
  const handleSearchChange = (v: string) => {
    setSearch(v);        // update input immediately — zero lag, zero jump
    setPage(1);          // reset to page 1
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(v), 400);
  };

  // Reset page when category or city changes
  const handleCategoryChange = (v: string) => { setCategory(v); setPage(1); };
  const handleCityChange     = (v: string) => { setCity(v);     setPage(1); };

  // Fetch events — triggered by debounced search, category, city, page
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams();
        if (category)       qs.set("category", category);
        if (city)           qs.set("city",     city);
        if (debouncedSearch) qs.set("search",  debouncedSearch);
        qs.set("page", page.toString());

        const res = await fetch(`/api/events?${qs}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (!cancelled) {
          setEvents(data.events);
          setTotal(data.total);
          setTotalPages(data.totalPages);
          setFirstLoad(false);
        }
      } catch {
        if (!cancelled) setError("Could not load events. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [category, city, debouncedSearch, page]);

  // Load reminders
  useEffect(() => {
    if (!token) return;
    fetch("/api/user/reminders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setReminderIds(new Set(d.eventIds)))
      .catch(() => {});
  }, [token]);

  const clearFilters = () => {
    setCategory(""); setCity(""); setSearch(""); setDebouncedSearch(""); setPage(1);
  };

  return (
    <>
      <PageHeader>
        <PageTitle>Upcoming Events</PageTitle>
        <Subtitle>
          {firstLoad
            ? "\u00a0"
            : loading
              ? <>{total} event{total !== 1 ? "s" : ""} found <Spinner /></>
              : `${total} event${total !== 1 ? "s" : ""} found`
          }
        </Subtitle>
      </PageHeader>

      <PageWrapper style={{ paddingTop: 0 }}>
        <FilterWrapper>
          <FilterBar
            category={category}
            city={city}
            search={search}
            onCategoryChange={handleCategoryChange}
            onCityChange={handleCityChange}
            onSearchChange={handleSearchChange}
          />
        </FilterWrapper>

        {/* Initial skeleton — shown only on very first page load */}
        {firstLoad && loading && (
          <EventGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <Skeleton $height="11rem" style={{ borderRadius: 0 }} />
                <SkeletonBody>
                  <Skeleton $height="1.1rem"   $width="75%" />
                  <Skeleton $height="0.875rem" $width="55%" />
                  <Skeleton $height="0.875rem" />
                </SkeletonBody>
              </SkeletonCard>
            ))}
          </EventGrid>
        )}

        {/* Error */}
        {!firstLoad && !loading && error && (
          <GlassPanel style={{ padding: "3rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>⚠️</EmptyIcon>
              <EmptyText>{error}</EmptyText>
              <PrimaryButton onClick={() => window.location.reload()}>Retry</PrimaryButton>
            </CenteredContent>
          </GlassPanel>
        )}

        {/* Empty state */}
        {!firstLoad && !loading && !error && events.length === 0 && (
          <GlassPanel style={{ padding: "4rem 2rem" }}>
            <CenteredContent style={{ padding: 0 }}>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No events found</EmptyTitle>
              <EmptyText>Try adjusting your filters or check back later for new events.</EmptyText>
              <PrimaryButton onClick={clearFilters}>Clear filters</PrimaryButton>
            </CenteredContent>
          </GlassPanel>
        )}

        {/* Grid — fades out gently while fetching; never replaced by skeletons mid-session */}
        {!firstLoad && !error && events.length > 0 && (
          <>
            <GridWrapper $loading={loading}>
              <EventGrid>
                {events.map((event, i) => (
                  <AnimatedCard key={event.id} $delay={firstLoad ? i * 0.05 : 0}>
                    <EventCard event={event} initialReminded={reminderIds.has(event.id)} />
                  </AnimatedCard>
                ))}
              </EventGrid>
            </GridWrapper>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </>
        )}
      </PageWrapper>
    </>
  );
}

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
