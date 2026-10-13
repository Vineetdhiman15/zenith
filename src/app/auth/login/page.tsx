"use client";
// src/app/auth/login/page.tsx — styled-components

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import {
  GlassPanel, PrimaryButton,
  InputField, FormLabel, FormGroup, ErrorBox,
} from "@/styles/shared";

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
  border-radius: ${theme.radii.lg};
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: ${theme.shadows.glow};
  font-size: 1.5rem;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: ${theme.colors.muted};
  }
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
  color: ${theme.colors.muted};
  margin-top: 1.5rem;

  a {
    color: #a78bfa;
    font-weight: 500;
    text-decoration: none;

    &:hover { color: #c4b5fd; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      // Redirect admins to dashboard, visitors to events listing
      router.push(result.role === "admin" ? "/admin/dashboard" : "/events");
    }
  };

  return (
    <Page>
      <Card>
        <IconBox>🔐</IconBox>
        <Heading>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </Heading>

        <Form onSubmit={handleSubmit} noValidate>
          <FormGroup>
            <FormLabel htmlFor="login-email">Email</FormLabel>
            <InputField
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="login-password">Password</FormLabel>
            <InputField
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </FormGroup>

          {error && <ErrorBox>{error}</ErrorBox>}

          <SubmitBtn
            as="button"
            type="submit"
            disabled={loading}
            id="login-submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </SubmitBtn>
        </Form>

        <Footer>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup">Sign up</Link>
        </Footer>
      </Card>
    </Page>
  );
}
