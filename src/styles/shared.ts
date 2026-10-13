// src/styles/shared.ts
// Re-usable styled primitives shared across pages and components.

import styled, { css, keyframes } from "styled-components";
import { theme } from "./theme";

// ─── Keyframes ───────────────────────────────────────────────────────────────
export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const bounceSlow = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

export const ping = keyframes`
  75%, 100% { transform: scale(2); opacity: 0; }
`;

// ─── Layout ──────────────────────────────────────────────────────────────────
export const PageWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const PageHeader = styled.div`
  text-align: center;
  padding: 3rem 1rem 2rem;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─── Glass panel ─────────────────────────────────────────────────────────────
export const GlassPanel = styled.div`
  background: rgba(17, 17, 34, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
`;

// ─── Buttons ─────────────────────────────────────────────────────────────────
const baseButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${theme.radii.md};
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const PrimaryButton = styled.button`
  ${baseButton}
  padding: 0.625rem 1.25rem;
  background: ${theme.gradients.primary};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.btn};
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;

export const GhostButton = styled.button`
  ${baseButton}
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  color: ${theme.colors.mutedLight};
  border: 1px solid ${theme.colors.border};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.10);
    color: white;
  }
`;

export const IconButton = styled.button`
  ${baseButton}
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  color: ${theme.colors.mutedLight};
  border: 1px solid ${theme.colors.border};
  font-size: 0.75rem;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.10);
    color: white;
  }
`;

// ─── Form inputs ─────────────────────────────────────────────────────────────
export const InputField = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: ${theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: white;
  font-size: 0.875rem;
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};

  &::placeholder { color: #475569; }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

export const SelectField = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: ${theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: white;
  font-size: 0.875rem;
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    outline: none;
  }

  option { background: #1e1e2e; color: white; }
`;

export const TextAreaField = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: ${theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: white;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};

  &::placeholder { color: #475569; }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.mutedLight};
  margin-bottom: 0.375rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// ─── Badges ──────────────────────────────────────────────────────────────────
export const ActiveBadge = styled.span`
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${theme.radii.full};
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const InactiveBadge = styled.span`
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.radii.full};
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

// ─── Skeleton loader ─────────────────────────────────────────────────────────
export const Skeleton = styled.div<{ $height?: string; $width?: string }>`
  height: ${(p) => p.$height ?? "1rem"};
  width:  ${(p) => p.$width  ?? "100%"};
  border-radius: ${theme.radii.sm};
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

// ─── Alert / Error box ───────────────────────────────────────────────────────
export const ErrorBox = styled.div`
  background: rgba(239, 68, 68, 0.10);
  border: 1px solid rgba(239, 68, 68, 0.30);
  color: #f87171;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${theme.radii.md};
`;

export const SuccessBox = styled.div`
  background: rgba(34, 197, 94, 0.10);
  border: 1px solid rgba(34, 197, 94, 0.30);
  color: #4ade80;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${theme.radii.md};
`;

// ─── Toast ───────────────────────────────────────────────────────────────────
export const Toast = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e2e;
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: ${theme.radii.full};
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  white-space: nowrap;
  animation: ${fadeInUp} 0.3s ease-out;
`;

// ─── Grid ────────────────────────────────────────────────────────────────────
export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
`;

// ─── Gradient text ───────────────────────────────────────────────────────────
export const GradientText = styled.span`
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─── Section heading ─────────────────────────────────────────────────────────
export const SectionHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

// ─── Divider ─────────────────────────────────────────────────────────────────
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 1.25rem 0;
`;

// ─── Centered container ──────────────────────────────────────────────────────
export const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
`;

// ─── Admin table ─────────────────────────────────────────────────────────────
export const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const AdminTh = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.muted};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const AdminTd = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
  color: ${theme.colors.text};
`;

export const AdminTr = styled.tr`
  &:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;
