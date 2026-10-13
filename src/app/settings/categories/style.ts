import styled, { css } from "styled-components";
import { GlassPanel } from "@/styles/shared";

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
  max-width: 28rem;
`;

export const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
  p  { font-size: 0.875rem; color: ${(p) => p.theme.colors.muted}; }
`;

export const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const CatBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: ${(p) => p.theme.fonts.body};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};
  border: 2px solid;

  ${(p) =>
    p.$selected
      ? css`
          border-color: ${(p) => p.theme.colors.primary};
          background: rgba(124, 58, 237, 0.2);
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
