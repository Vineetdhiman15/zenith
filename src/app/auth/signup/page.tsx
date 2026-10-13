"use client";
// src/app/auth/signup/page.tsx — styled-components

import { useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  GlassPanel, PrimaryButton,
  InputField, FormLabel, FormGroup, ErrorBox,
} from "@/styles/shared";

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const ICONS: Record<string, string> = {
  Music: "🎵", Workshop: "🛠️", Food: "🍽️", Sports: "🏅", Kids: "🎈",
};

// ─── Styled components ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: calc(100dvh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const Card = styled(GlassPanel)`
  padding: 2rem;
  width: 100%;
  max-width: 26rem;
`;

const IconBox = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${(p) => p.theme.radii.lg};
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: ${(p) => p.theme.shadows.glow};
  font-size: 1.5rem;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1, h2 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
  p { font-size: 0.875rem; color: ${(p) => p.theme.colors.muted}; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmitBtn = styled(PrimaryButton)`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 1.5rem;

  a { color: #a78bfa; font-weight: 500; text-decoration: none; &:hover { color: #c4b5fd; } }
`;

const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const CatBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${(p) => p.theme.fonts.body};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};
  border: 2px solid;

  ${(p) =>
    p.$selected
      ? css`
          border-color: ${(p) => p.theme.colors.primary};
          background: rgba(124, 58, 237, 0.18);
          color: white;
          box-shadow: ${(p) => p.theme.shadows.glow};
          transform: scale(1.02);
        `
      : css`
          border-color: ${(p) => p.theme.colors.border};
          background: rgba(255, 255, 255, 0.04);
          color: ${(p) => p.theme.colors.mutedLight};
          &:hover { border-color: rgba(255,255,255,0.2); color: white; }
        `}
`;

const CatIcon = styled.span`
  font-size: 1.25rem;
`;

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
