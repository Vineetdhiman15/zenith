"use client";
import Link from "next/link";
import { PrimaryButton } from "@/styles/shared";
import { Wrapper, Code, Title, Subtitle } from "./not-found.style";

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
