// src/app/not-found.tsx — 404 page with styled-components
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { PrimaryButton } from "@/styles/shared";

const Wrapper = styled.div`
  min-height: calc(100dvh - 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
`;

const Code = styled.div`
  font-size: 6rem;
  font-weight: 800;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
`;

const Subtitle = styled.p`
  color: ${theme.colors.muted};
  margin-bottom: 2rem;
  max-width: 28rem;
`;

export default function NotFound() {
  return (
    <Wrapper>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Subtitle>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Subtitle>
      <Link href="/">
        <PrimaryButton>Go Home</PrimaryButton>
      </Link>
    </Wrapper>
  );
}
