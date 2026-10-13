"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  PageWrapper, PageHeader, PageTitle,
  PrimaryButton, GhostButton,
  ActiveBadge, InactiveBadge, Skeleton,
  AdminTable, AdminTh, AdminTd, AdminTr,
} from "@/styles/shared";
import { formatFriendlyDate, formatIndianCurrency } from "@/lib/format";
import type { Event } from "@/components/EventCard";
import {
  HeaderRow, TableTitle, TableWrapper, TableInner, ToggleBtn, EditLink,
  CountBadge, EmptyRow, TruncatedCell,
} from "./style";

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents]       = useState<Event[]>([]);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data.events ?? []);
    setLoading(false);
  };

  const handleToggle = async (event: Event) => {
    setToggling(event.id);
    await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: event.is_active !== 1 }),
    });
    await load();
    setToggling(null);
  };

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <Skeleton $height="2rem" $width="14rem" style={{ margin: "2rem 0" }} />
        <Skeleton $height="28rem" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader style={{ textAlign: "left", padding: "1rem 0 2rem" }}>
        <PageTitle style={{ fontSize: "1.75rem" }}>Manage Events</PageTitle>
      </PageHeader>

      <TableWrapper>
        <TableInner>
          <HeaderRow>
            <TableTitle>
              All Events <CountBadge>({events.length})</CountBadge>
            </TableTitle>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/admin/dashboard">
                <GhostButton style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                  Dashboard
                </GhostButton>
              </Link>
              <Link href="/admin/events/new">
                <PrimaryButton style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                  + New Event
                </PrimaryButton>
              </Link>
            </div>
          </HeaderRow>
        </TableInner>

        <AdminTable>
          <thead>
            <tr>
              <AdminTh>#</AdminTh>
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
            {events.length === 0 && (
              <EmptyRow>
                <td colSpan={8}>No events yet. Create your first event!</td>
              </EmptyRow>
            )}
            {events.map((event) => (
              <AdminTr key={event.id}>
                <AdminTd style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                  {event.id}
                </AdminTd>
                <AdminTd>
                  <TruncatedCell>{event.title}</TruncatedCell>
                </AdminTd>
                <AdminTd>{event.category}</AdminTd>
                <AdminTd>{event.city}</AdminTd>
                <AdminTd style={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                  {formatFriendlyDate(event.date_time)}
                </AdminTd>
                <AdminTd>{formatIndianCurrency(event.price)}</AdminTd>
                <AdminTd>
                  {event.is_active === 1
                    ? <ActiveBadge>Active</ActiveBadge>
                    : <InactiveBadge>Inactive</InactiveBadge>}
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <ToggleBtn
                      $active={event.is_active === 1}
                      disabled={toggling === event.id}
                      onClick={() => handleToggle(event)}
                    >
                      {toggling === event.id
                        ? "…"
                        : event.is_active === 1 ? "Deactivate" : "Activate"}
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
