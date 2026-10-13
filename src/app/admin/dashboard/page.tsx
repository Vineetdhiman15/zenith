"use client";
// src/app/admin/dashboard/page.tsx — styled-components

import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import {
  PageWrapper, PageHeader, PageTitle,
  GlassPanel, PrimaryButton,
  ActiveBadge, InactiveBadge, Skeleton,
  AdminTable, AdminTh, AdminTd, AdminTr,
} from "@/styles/shared";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import type { Event } from "@/components/EventCard";

// ─── Styled components ────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: ${theme.breakpoints.md}) { grid-template-columns: repeat(4, 1fr); }
`;

const StatCard = styled(GlassPanel)`
  padding: 1.25rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const TableWrapper = styled(GlassPanel)`
  overflow: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TableTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${theme.radii.full};
  border: 1px solid;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  transition: all ${theme.transitions.fast};

  ${(p) =>
    p.$active
      ? `background: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.3);`
      : `background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3);`}

  &:hover { filter: brightness(1.2); }
`;

const EditLink = styled(Link)`
  font-size: 0.75rem;
  color: #a78bfa;
  text-decoration: none;
  &:hover { color: white; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setEvents(data.events ?? []);
    setLoading(false);
  };

  const handleToggle = async (event: Event) => {
    setToggling(event.id);
    await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: event.is_active === 1 ? false : true }),
    });
    await fetchEvents();
    setToggling(null);
  };

  const total    = events.length;
  const active   = events.filter((e) => e.is_active === 1).length;
  const inactive = total - active;
  const now      = new Date().toISOString();
  const upcoming = events.filter((e) => e.is_active === 1 && e.date_time > now).length;

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <StatsGrid>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} $height="5rem" />)}</StatsGrid>
        <Skeleton $height="20rem" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader style={{ textAlign: "left", padding: "1rem 0 2rem" }}>
        <PageTitle style={{ fontSize: "1.75rem" }}>Admin Dashboard</PageTitle>
      </PageHeader>

      {/* Stats */}
      <StatsGrid>
        <StatCard><StatValue>{total}</StatValue><StatLabel>Total Events</StatLabel></StatCard>
        <StatCard><StatValue>{active}</StatValue><StatLabel>Active</StatLabel></StatCard>
        <StatCard><StatValue>{upcoming}</StatValue><StatLabel>Upcoming</StatLabel></StatCard>
        <StatCard><StatValue>{inactive}</StatValue><StatLabel>Inactive</StatLabel></StatCard>
      </StatsGrid>

      {/* Table */}
      <TableWrapper>
        <div style={{ padding: "1.25rem 1.25rem 0" }}>
          <HeaderRow>
            <TableTitle>All Events</TableTitle>
            <Link href="/admin/events/new">
              <PrimaryButton style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                + New Event
              </PrimaryButton>
            </Link>
          </HeaderRow>
        </div>

        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Title</AdminTh>
              <AdminTh>Category</AdminTh>
              <AdminTh>City</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh>Price</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <AdminTr key={event.id}>
                <AdminTd style={{ fontWeight: 500, color: "white", maxWidth: "12rem" }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {event.title}
                  </div>
                </AdminTd>
                <AdminTd>{event.category}</AdminTd>
                <AdminTd>{event.city}</AdminTd>
                <AdminTd style={{ whiteSpace: "nowrap" }}>{formatFriendlyDate(event.date_time)}</AdminTd>
                <AdminTd>{formatIndianCurrency(event.price)}</AdminTd>
                <AdminTd>
                  {event.is_active === 1 ? (
                    <ActiveBadge>Active</ActiveBadge>
                  ) : (
                    <InactiveBadge>Inactive</InactiveBadge>
                  )}
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <ToggleBtn
                      $active={event.is_active === 1}
                      onClick={() => handleToggle(event)}
                      disabled={toggling === event.id}
                    >
                      {toggling === event.id ? "…" : event.is_active === 1 ? "Deactivate" : "Activate"}
                    </ToggleBtn>
                    <EditLink href={`/admin/events/${event.id}/edit`}>Edit</EditLink>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
      </TableWrapper>
    </PageWrapper>
  );
}
