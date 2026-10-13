// src/styles/shared.ts
// Re-usable styled primitives — ALL read colours from ThemeProvider context.

import styled, { css, keyframes } from "styled-components";

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
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─── Glass panel ─────────────────────────────────────────────────────────────
export const GlassPanel = styled.div`
  background: ${(p) => p.theme.colors.surface};
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: ${(p) => p.theme.shadows.surface};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

// ─── Buttons ─────────────────────────────────────────────────────────────────
const baseButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${(p) => p.theme.radii.md};
  font-family: ${(p) => p.theme.fonts.body};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all ${(p) => p.theme.transitions.normal};
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
  background: ${(p) => p.theme.gradients.primary};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${(p) => p.theme.shadows.btn};
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;

export const GhostButton = styled.button`
  ${baseButton}
  padding: 0.625rem 1.25rem;
  background: ${(p) => p.theme.colors.ghostBg};
  color: ${(p) => p.theme.colors.mutedLight};
  border: 1px solid ${(p) => p.theme.colors.border};

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.ghostHoverBg};
    color: ${(p) => p.theme.colors.text};
  }
`;

export const IconButton = styled.button`
  ${baseButton}
  padding: 0.5rem 0.75rem;
  background: ${(p) => p.theme.colors.ghostBg};
  color: ${(p) => p.theme.colors.mutedLight};
  border: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.75rem;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.ghostHoverBg};
    color: ${(p) => p.theme.colors.text};
  }
`;

// ─── Form inputs ─────────────────────────────────────────────────────────────
export const InputField = styled.input`
  width: 100%;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  transition: border-color ${(p) => p.theme.transitions.fast}, box-shadow ${(p) => p.theme.transitions.fast};

  &::placeholder { color: ${(p) => p.theme.colors.muted}; }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

export const SelectField = styled.select`
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  transition: border-color ${(p) => p.theme.transitions.fast}, box-shadow ${(p) => p.theme.transitions.fast};
  cursor: pointer;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    outline: none;
  }

  option { background: ${(p) => p.theme.colors.surface}; color: ${(p) => p.theme.colors.text}; }
`;

export const TextAreaField = styled.textarea`
  width: 100%;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0.625rem 0.875rem;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color ${(p) => p.theme.transitions.fast}, box-shadow ${(p) => p.theme.transitions.fast};

  &::placeholder { color: ${(p) => p.theme.colors.muted}; }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mutedLight};
  margin-bottom: 0.375rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// ─── Badges ──────────────────────────────────────────────────────────────────
export const ActiveBadge = styled.span`
  background: ${(p) => p.theme.colors.badgeActiveBg};
  color:      ${(p) => p.theme.colors.badgeActiveColor};
  border: 1px solid ${(p) => p.theme.colors.badgeActiveBorder};
  border-radius: ${(p) => p.theme.radii.full};
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const InactiveBadge = styled.span`
  background: ${(p) => p.theme.colors.badgeInactiveBg};
  color:      ${(p) => p.theme.colors.badgeInactiveColor};
  border: 1px solid ${(p) => p.theme.colors.badgeInactiveBorder};
  border-radius: ${(p) => p.theme.radii.full};
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

// ─── Skeleton loader ─────────────────────────────────────────────────────────
export const Skeleton = styled.div<{ $height?: string; $width?: string }>`
  height: ${(p) => p.$height ?? "1rem"};
  width:  ${(p) => p.$width  ?? "100%"};
  border-radius: ${(p) => p.theme.radii.sm};
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.skeleton1} 25%,
    ${(p) => p.theme.colors.skeleton2} 50%,
    ${(p) => p.theme.colors.skeleton1} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

// ─── Alert boxes ─────────────────────────────────────────────────────────────
export const ErrorBox = styled.div`
  background: ${(p) => p.theme.colors.badgeInactiveBg};
  border: 1px solid ${(p) => p.theme.colors.badgeInactiveBorder};
  color: ${(p) => p.theme.colors.danger};
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${(p) => p.theme.radii.md};
`;

export const SuccessBox = styled.div`
  background: ${(p) => p.theme.colors.badgeActiveBg};
  border: 1px solid ${(p) => p.theme.colors.badgeActiveBorder};
  color: ${(p) => p.theme.colors.success};
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${(p) => p.theme.radii.md};
`;

// ─── Toast ───────────────────────────────────────────────────────────────────
export const Toast = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.primary};
  border-radius: ${(p) => p.theme.radii.full};
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  color: ${(p) => p.theme.colors.muted};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const AdminTd = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  vertical-align: middle;
  color: ${(p) => p.theme.colors.text};
`;

export const AdminTr = styled.tr`
  &:hover td {
    background: ${(p) => p.theme.colors.primaryFaded};
  }
`;
