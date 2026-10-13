"use client";
// src/app/admin/events/new/page.tsx — Create new event form (styled-components)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";
import {
  PageWrapper, GlassPanel, PrimaryButton, GhostButton,
  InputField, SelectField, TextAreaField, FormLabel, FormGroup,
  ErrorBox, SuccessBox,
} from "@/styles/shared";

// ─── Styled components ────────────────────────────────────────────────────────
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const FormCard = styled(GlassPanel)`
  padding: 1.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: ${theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }
`;

const FullWidth = styled.div`
  @media (min-width: ${theme.breakpoints.md}) { grid-column: 1 / -1; }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: ${theme.colors.mutedLight};
  font-size: 0.875rem;
  font-weight: 500;

  input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

// ─── Component ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];

export default function NewEventPage() {
  const { token, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "", category: "Music", city: "", date_time: "", price: "",
    description: "", image_url: "", is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  if (!authLoading && (!user || user.role !== "admin")) {
    router.push("/");
    return null;
  }

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price) || 0 }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Failed to create event"); return; }
    setSuccess("Event created successfully!");
    setTimeout(() => router.push("/admin/dashboard"), 1200);
  };

  return (
    <PageWrapper style={{ maxWidth: "52rem" }}>
      <Header>
        <Title>New Event</Title>
        <Link href="/admin/dashboard">
          <GhostButton style={{ fontSize: "0.875rem" }}>← Back to dashboard</GhostButton>
        </Link>
      </Header>

      <FormCard>
        <form onSubmit={handleSubmit} noValidate>
          <FormGrid>
            <FullWidth>
              <FormGroup>
                <FormLabel htmlFor="ev-title">Title *</FormLabel>
                <InputField id="ev-title" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event title" />
              </FormGroup>
            </FullWidth>

            <FormGroup>
              <FormLabel htmlFor="ev-category">Category *</FormLabel>
              <SelectField id="ev-category" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="ev-city">City *</FormLabel>
              <InputField id="ev-city" required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Chennai" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="ev-datetime">Date & Time *</FormLabel>
              <InputField id="ev-datetime" type="datetime-local" required value={form.date_time} onChange={(e) => set("date_time", e.target.value)} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="ev-price">Price (₹)</FormLabel>
              <InputField id="ev-price" type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0 for free" />
            </FormGroup>

            <FullWidth>
              <FormGroup>
                <FormLabel htmlFor="ev-image">Image URL</FormLabel>
                <InputField id="ev-image" type="url" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" />
              </FormGroup>
            </FullWidth>

            <FullWidth>
              <FormGroup>
                <FormLabel htmlFor="ev-desc">Description</FormLabel>
                <TextAreaField id="ev-desc" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the event…" />
              </FormGroup>
            </FullWidth>

            <FullWidth>
              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  id="ev-active"
                />
                <span>Publish immediately (Active)</span>
              </CheckboxRow>
            </FullWidth>
          </FormGrid>

          {error   && <ErrorBox   style={{ marginTop: "1rem" }}>{error}</ErrorBox>}
          {success && <SuccessBox style={{ marginTop: "1rem" }}>{success}</SuccessBox>}

          <Footer>
            <Link href="/admin/dashboard">
              <GhostButton type="button">Cancel</GhostButton>
            </Link>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create Event"}
            </PrimaryButton>
          </Footer>
        </form>
      </FormCard>
    </PageWrapper>
  );
}
