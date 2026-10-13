"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  InputField, FormLabel, FormGroup, ErrorBox,
} from "@/styles/shared";
import {
  Page, Card, IconBox, Heading, Form, SubmitBtn, Footer,
  CatGrid, CatBtn, CatIcon,
} from "./style";

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const { signup, token } = useAuth();
  const router = useRouter();

  const [step, setStep]         = useState<"form" | "categories">("form");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signup(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else setStep("categories");
  };

  const toggleCategory = (cat: string) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSaveCategories = async () => {
    setLoading(true);
    await fetch("/api/user/favourites", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categories: selected }),
    });
    setLoading(false);
    router.push("/feed");
  };

  return (
    <Page>
      <Card>
        {step === "form" && (
          <>
            <IconBox>✨</IconBox>
            <Heading>
              <h1>Create an account</h1>
              <p>Join the community</p>
            </Heading>

            <Form onSubmit={handleSignup} noValidate>
              <FormGroup>
                <FormLabel htmlFor="signup-email">Email</FormLabel>
                <InputField
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="signup-password">Password</FormLabel>
                <InputField
                  id="signup-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                />
              </FormGroup>

              {error && <ErrorBox>{error}</ErrorBox>}

              <SubmitBtn as="button" type="submit" disabled={loading} id="signup-submit">
                {loading ? "Creating account…" : "Create account"}
              </SubmitBtn>
            </Form>

            <Footer>
              Already have an account?{" "}
              <Link href="/auth/login">Sign in</Link>
            </Footer>
          </>
        )}

        {step === "categories" && (
          <>
            <IconBox>🎯</IconBox>
            <Heading>
              <h2>Pick your interests</h2>
              <p>Select the event types you love. Your feed will show only these.</p>
            </Heading>

            <CatGrid>
              {CATEGORIES.map((cat) => (
                <CatBtn
                  key={cat}
                  $selected={selected.includes(cat)}
                  onClick={() => toggleCategory(cat)}
                  type="button"
                  aria-pressed={selected.includes(cat)}
                >
                  <CatIcon>{ICONS[cat]}</CatIcon>
                  {cat}
                </CatBtn>
              ))}
            </CatGrid>

            <SubmitBtn
              as="button"
              type="button"
              onClick={handleSaveCategories}
              disabled={loading}
              id="save-categories-btn"
            >
              {loading
                ? "Saving…"
                : selected.length > 0
                ? `Continue with ${selected.length} selected →`
                : "Skip for now →"}
            </SubmitBtn>
          </>
        )}
      </Card>
    </Page>
  );
}
