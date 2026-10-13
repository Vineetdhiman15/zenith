"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PageWrapper, PrimaryButton, GhostButton,
  InputField, SelectField, TextAreaField, FormLabel, FormGroup,
  ErrorBox, SuccessBox, Skeleton,
} from "@/styles/shared";
import {
  Header, Title, FormCard, FormGrid, FullWidth, CheckboxRow, Footer,
} from "./style";

// ─── Component ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];

export default function EditEventPage() {
  const { id }  = useParams<{ id: string }>();
  const { token, user, loading: authLoading } = useAuth();
  const router  = useRouter();

  const [form, setForm] = useState({
    title: "", category: "Music", city: "", date_time: "", price: "",
    description: "", image_url: "", is_active: true,
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }

    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then(({ event }) => {
        if (!event) { setError("Event not found"); return; }
        setForm({
          title: event.title,
          category: event.category,
          city: event.city,
          date_time: event.date_time.slice(0, 16), // for datetime-local input
          price: event.price.toString(),
          description: event.description,
          image_url: event.image_url,
          is_active: event.is_active === 1,
        });
      })
      .catch(() => setError("Failed to load event"))
      .finally(() => setPageLoading(false));
  }, [id, user, token, authLoading, router]);

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);

    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price) || 0 }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Failed to update event"); return; }
    setSuccess("Event updated successfully!");
    setTimeout(() => router.push("/admin/dashboard"), 1200);
  };

  if (authLoading || pageLoading) {
    return (
      <PageWrapper style={{ maxWidth: "52rem" }}>
        <Skeleton $height="2rem" $width="12rem" style={{ marginBottom: "2rem" }} />
        <Skeleton $height="28rem" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper style={{ maxWidth: "52rem" }}>
      <Header>
        <Title>Edit Event</Title>
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
                <InputField id="ev-title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
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
              <InputField id="ev-city" required value={form.city} onChange={(e) => set("city", e.target.value)} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="ev-datetime">Date & Time *</FormLabel>
              <InputField id="ev-datetime" type="datetime-local" required value={form.date_time} onChange={(e) => set("date_time", e.target.value)} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="ev-price">Price (₹)</FormLabel>
              <InputField id="ev-price" type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </FormGroup>

            <FullWidth>
              <FormGroup>
                <FormLabel htmlFor="ev-image">Image URL</FormLabel>
                <InputField id="ev-image" type="url" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} />
              </FormGroup>
            </FullWidth>

            <FullWidth>
              <FormGroup>
                <FormLabel htmlFor="ev-desc">Description</FormLabel>
                <TextAreaField id="ev-desc" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </FormGroup>
            </FullWidth>

            <FullWidth>
              <CheckboxRow>
                <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} id="ev-active" />
                <span>Active (visible to visitors)</span>
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
              {saving ? "Saving…" : "Save Changes"}
            </PrimaryButton>
          </Footer>
        </form>
      </FormCard>
    </PageWrapper>
  );
}
