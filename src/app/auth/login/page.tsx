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
} from "./style";

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
