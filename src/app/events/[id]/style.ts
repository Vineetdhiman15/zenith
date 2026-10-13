import Link from "next/link";
import styled from "styled-components";
import { GlassPanel } from "@/styles/shared";

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover { color: white; }
`;

export const HeroImage = styled.div`
  position: relative;
  height: 18rem;
  border-radius: ${(p) => p.theme.radii.xl};
  overflow: hidden;
  margin-bottom: 2rem;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) { height: 24rem; }
`;

export const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.2) 50%, transparent 100%);
`;

export const HeroCategoryBadge = styled.span`
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${(p) => p.theme.radii.full};
  background: rgba(124,58,237,0.7);
  color: white;
  backdrop-filter: blur(8px);
`;

export const Grid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { grid-template-columns: 2fr 1fr; }
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 0.75rem;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const AboutPanel = styled(GlassPanel)`
  padding: 1.25rem;
  margin-top: 1.25rem;
`;

export const AboutLabel = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.75rem;
`;

export const AboutText = styled.p`
  color: ${(p) => p.theme.colors.mutedLight};
  line-height: 1.75;
  font-size: 0.9375rem;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PricePanel = styled(GlassPanel)`
  padding: 1.25rem;
  text-align: center;
`;

export const PriceLabel = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.25rem;
`;

export const PriceValue = styled.p`
  font-size: 2rem;
  font-weight: 800;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ReminderBtn = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.875rem;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: ${(p) => p.theme.fonts.body};
  border: none;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};

  ${(p) =>
    p.$active
      ? `background: ${p.theme.colors.primary}; color: white; box-shadow: ${p.theme.shadows.glow};`
      : `background: ${p.theme.colors.ghostBg}; color: ${p.theme.colors.mutedLight}; border: 1px solid ${p.theme.colors.border};`}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

export const DesignerPanel = styled(GlassPanel)`
  padding: 1.5rem;
  margin-top: 2.5rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
