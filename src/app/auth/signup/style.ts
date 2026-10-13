import styled, { css } from "styled-components";
import { GlassPanel, PrimaryButton } from "@/styles/shared";

export const Page = styled.div`
  min-height: calc(100dvh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

export const Card = styled(GlassPanel)`
  padding: 2rem;
  width: 100%;
  max-width: 26rem;
`;

export const IconBox = styled.div`
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

export const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1, h2 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
  p { font-size: 0.875rem; color: ${(p) => p.theme.colors.muted}; }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SubmitBtn = styled(PrimaryButton)`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
`;

export const Footer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 1.5rem;

  a { color: #a78bfa; font-weight: 500; text-decoration: none; &:hover { color: #c4b5fd; } }
`;

export const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const CatBtn = styled.button<{ $selected: boolean }>`
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

export const CatIcon = styled.span`
  font-size: 1.25rem;
`;
