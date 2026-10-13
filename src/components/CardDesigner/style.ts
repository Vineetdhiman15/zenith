import styled, { css, keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardPreview = styled.div<{ $gradient: string }>`
  position: relative;
  border-radius: ${(p) => p.theme.radii.xl};
  background: ${(p) => p.$gradient};
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1.5rem;
  min-height: 11rem;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  transition: background ${(p) => p.theme.transitions.slow};
`;

export const GlowOrb = styled.div`
  position: absolute;
  bottom: -2rem;
  right: -2rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  filter: blur(1.5rem);
  pointer-events: none;
`;

export const CardCategory = styled.div<{ $glowColor?: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.375rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  line-height: 1.25;
  margin-bottom: 0.375rem;
`;

export const CardDate = styled.p`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.375rem;
`;

export const CardPrice = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

export const StickersLayer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: flex-end;
  max-width: 5rem;
`;

export const FloatingSticker = styled.span<{ $delay: number }>`
  font-size: 1.5rem;
  display: inline-block;
  animation: ${float} 2.5s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.25rem;
`;

export const SavingText = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const SavedText = styled.span`
  font-size: 0.75rem;
  color: #4ade80;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const HintText = styled.span`
  font-size: 0.75rem;
  color: #fbbf24;
`;

export const SubLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mutedLight};
  margin-bottom: 0.75rem;
`;

export const ThemeGrid = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ThemeBtn = styled.button<{ $gradient: string; $active: boolean }>`
  flex: 1;
  height: 4rem;
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.$gradient};
  display: flex;
  align-items: flex-end;
  padding: 0.5rem 0.625rem;
  border: 2px solid ${(p) => (p.$active ? "rgba(255,255,255,0.9)" : "transparent")};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};
  opacity: ${(p) => (p.$active ? 1 : 0.55)};
  transform: ${(p) => (p.$active ? "scale(1.05)" : "scale(1)")};

  ${(p) =>
    p.$active &&
    css`
      box-shadow: ${(p) => p.theme.shadows.glow};
    `}

  &:hover:not([aria-pressed="true"]) {
    opacity: 0.85;
  }

  span {
    font-size: 0.7rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

export const StickerGrid = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const StickerBtn = styled.button<{ $selected: boolean; $maxed: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 1.5rem;
  border: 2px solid;
  cursor: ${(p) => (p.$maxed ? "not-allowed" : "pointer")};
  transition: all ${(p) => p.theme.transitions.normal};
  background: none;

  ${(p) =>
    p.$selected
      ? css`
          border-color: ${(p) => p.theme.colors.primary};
          background: rgba(124, 58, 237, 0.2);
          transform: scale(1.12);
          box-shadow: ${(p) => p.theme.shadows.glow};
        `
      : p.$maxed
      ? css`
          border-color: rgba(255, 255, 255, 0.06);
          opacity: 0.25;
        `
      : css`
          border-color: rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          &:hover { border-color: rgba(255,255,255,0.25); transform: scale(1.06); }
        `}
`;

export const ClearBtn = styled.button`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover { color: ${(p) => p.theme.colors.mutedLight}; }
`;
