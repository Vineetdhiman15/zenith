import Link from "next/link";
import styled, { keyframes } from "styled-components";

const orbPulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.05); }
`;

export const Hero = styled.section`
  position: relative;
  min-height: calc(100dvh - 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  overflow: hidden;
`;

export const Orb = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $size?: string; $color?: string; $delay?: string }>`
  position: absolute;
  width:  ${(p) => p.$size ?? "24rem"};
  height: ${(p) => p.$size ?? "24rem"};
  top:    ${(p) => p.$top    ?? "auto"};
  left:   ${(p) => p.$left   ?? "auto"};
  right:  ${(p) => p.$right  ?? "auto"};
  bottom: ${(p) => p.$bottom ?? "auto"};
  border-radius: 50%;
  background: ${(p) => p.$color ?? "rgba(124,58,237,0.15)"};
  filter: blur(5rem);
  pointer-events: none;
  animation: ${orbPulse} 4s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay ?? "0s"};
`;

export const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: #c4b5fd;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

export const PingDot = styled.span`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #a78bfa;
  animation: ping 1.5s ease-in-out infinite;

  @keyframes ping {
    0%       { box-shadow: 0 0 0 0 rgba(167,139,250,0.6); }
    70%, 100%{ box-shadow: 0 0 0 6px rgba(167,139,250,0); }
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 48rem;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.25rem;
`;

export const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.mutedLight};
  max-width: 36rem;
  margin: 0 auto 2rem;
  line-height: 1.7;
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const CategoriesSection = styled.section`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem 5rem;
`;

export const CatHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

export const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: ${(p) => p.theme.breakpoints.lg}) { grid-template-columns: repeat(5, 1fr); }
`;

export const CatCard = styled(Link)`
  background: rgba(17, 17, 34, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 1.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all ${(p) => p.theme.transitions.normal};

  &:hover {
    border-color: rgba(124, 58, 237, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }
`;

export const CatIcon = styled.div`
  font-size: 2.5rem;
  transition: transform ${(p) => p.theme.transitions.normal};

  ${CatCard}:hover & { transform: scale(1.15); }
`;

export const CatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
`;

export const CatDesc = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;
