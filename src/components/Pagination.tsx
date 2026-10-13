"use client";
// src/components/Pagination.tsx — fully styled-components

import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

// ─── Styled components ────────────────────────────────────────────────────────
const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
`;

const NavBtn = styled.button<{ $disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$disabled ? 0.3 : 1)};
  background: rgba(255, 255, 255, 0.05);
  color: ${theme.colors.mutedLight};
  transition: all ${theme.transitions.fast};

  &:hover:not([disabled]) {
    background: rgba(255, 255, 255, 0.10);
    color: white;
  }
`;

const Pages = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const PageBtn = styled.button<{ $active: boolean }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  ${(p) =>
    p.$active
      ? css`
          background: ${theme.colors.primary};
          color: white;
          box-shadow: ${theme.shadows.glow};
        `
      : css`
          background: rgba(255, 255, 255, 0.05);
          color: ${theme.colors.mutedLight};
          &:hover { background: rgba(255,255,255,0.10); color: white; }
        `}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Wrapper aria-label="Pagination">
      <NavBtn
        $disabled={page === 1}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ← Prev
      </NavBtn>

      <Pages>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PageBtn
            key={p}
            $active={p === page}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PageBtn>
        ))}
      </Pages>

      <NavBtn
        $disabled={page === totalPages}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next →
      </NavBtn>
    </Wrapper>
  );
}
