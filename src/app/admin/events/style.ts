import Link from "next/link";
import styled from "styled-components";
import { GlassPanel } from "@/styles/shared";

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

export const TableWrapper = styled(GlassPanel)`
  overflow: auto;
`;

export const TableInner = styled.div`
  padding: 1.25rem 1.25rem 0;
`;

export const ToggleBtn = styled.button<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: ${(p) => p.theme.radii.full};
  border: 1px solid;
  cursor: pointer;
  font-family: ${(p) => p.theme.fonts.body};
  transition: all ${(p) => p.theme.transitions.fast};
  background: none;

  ${(p) =>
    p.$active
      ? `color: #f87171; border-color: rgba(239,68,68,0.4); &:hover { background: rgba(239,68,68,0.1); }`
      : `color: #4ade80; border-color: rgba(34,197,94,0.4); &:hover { background: rgba(34,197,94,0.1); }`}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const EditLink = styled(Link)`
  font-size: 0.75rem;
  color: #a78bfa;
  text-decoration: none;
  padding: 0.3rem 0.75rem;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid rgba(167,139,250,0.3);
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover { background: rgba(167,139,250,0.1); color: white; }
`;

export const CountBadge = styled.span`
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 400;
`;

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 3rem 1rem;
    color: ${(p) => p.theme.colors.muted};
    font-size: 0.9rem;
  }
`;

export const TruncatedCell = styled.div`
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: white;
`;
