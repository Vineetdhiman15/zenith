"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  PrimaryButton, SuccessBox, ErrorBox,
} from "@/styles/shared";
import { Page, Card, Heading, CatGrid, CatBtn } from "./style";

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoriesSettingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }

    // Load existing favourites
    fetch("/api/user/favourites", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setSelected(d.categories ?? []))
      .catch(() => {});
  }, [user, token, authLoading, router]);

  const toggle = (cat: string) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSave = async () => {
    setError(""); setSuccess("");
    setSaving(true);
    const res = await fetch("/api/user/favourites", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categories: selected }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess("Preferences saved! Your feed has been updated.");
      setTimeout(() => router.push("/feed"), 1500);
    } else {
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
    <Page>
      <Card>
        <Heading>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
          <h1>Your Interests</h1>
          <p>Choose the event types you want in your feed.</p>
        </Heading>

        <CatGrid>
          {CATEGORIES.map((cat) => (
            <CatBtn
              key={cat}
              $selected={selected.includes(cat)}
              onClick={() => toggle(cat)}
              aria-pressed={selected.includes(cat)}
            >
              <span style={{ fontSize: "1.25rem" }}>{ICONS[cat]}</span>
              {cat}
            </CatBtn>
          ))}
        </CatGrid>

        {success && <SuccessBox style={{ marginBottom: "1rem" }}>{success}</SuccessBox>}
        {error   && <ErrorBox   style={{ marginBottom: "1rem" }}>{error}</ErrorBox>}

        <PrimaryButton
          style={{ width: "100%", padding: "0.75rem" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Preferences →"}
        </PrimaryButton>
      </Card>
    </Page>
  );
}
