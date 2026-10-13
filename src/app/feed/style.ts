import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AnimatedCard = styled.div<{ $delay: number }>`
  animation: ${fadeInUp} 0.4s ease-out both;
  animation-delay: ${(p) => p.$delay}s;
`;

export const CatChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
`;

export const CatChip = styled.span`
  padding: 0.3rem 0.875rem;
  border-radius: ${(p) => p.theme.radii.full};
  background: rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
  font-size: 0.875rem;
  border: 1px solid rgba(124, 58, 237, 0.35);
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

export const EmptyText = styled.p`
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 1.5rem;
  max-width: 28rem;
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
