import Link from "next/link";
import styled from "styled-components";
import { GlassPanel } from "@/styles/shared";

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { grid-template-columns: repeat(4, 1fr); }
`;

export const StatCard = styled(GlassPanel)`
  padding: 1.25rem;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

export const TableWrapper = styled(GlassPanel)`
  overflow: auto;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TableTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
`;

export const ToggleBtn = styled.button<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${(p) => p.theme.radii.full};
  border: 1px solid;
  cursor: pointer;
  font-family: ${(p) => p.theme.fonts.body};
  transition: all ${(p) => p.theme.transitions.fast};

  ${(p) =>
    p.$active
      ? `background: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.3);`
      : `background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3);`}

  &:hover { filter: brightness(1.2); }
`;

export const EditLink = styled(Link)`
  font-size: 0.75rem;
  color: #a78bfa;
  text-decoration: none;
  &:hover { color: white; }
`;
