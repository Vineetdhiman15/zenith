import styled, { keyframes } from "styled-components";
import { GlassPanel } from "@/styles/shared";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AnimatedCard = styled.div<{ $delay: number }>`
  animation: ${fadeInUp} 0.4s ease-out both;
  animation-delay: ${(p) => p.$delay}s;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9375rem;
  margin-top: 0.5rem;
  min-height: 1.4rem;
`;

export const FilterWrapper = styled(GlassPanel)`
  padding: 1rem;
  margin-bottom: 2rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const EmptyText = styled.p`
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 1.5rem;
`;

export const SkeletonCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  overflow: hidden;
`;

export const SkeletonBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const GridWrapper = styled.div<{ $loading: boolean }>`
  opacity: ${(p) => (p.$loading ? 0.45 : 1)};
  transition: opacity 0.2s ease;
  pointer-events: ${(p) => (p.$loading ? "none" : "auto")};
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid ${(p) => p.theme.colors.primary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 0.5rem;
  vertical-align: middle;

  @keyframes spin { to { transform: rotate(360deg); } }
`;
