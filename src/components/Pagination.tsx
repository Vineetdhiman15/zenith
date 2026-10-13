"use client";
// src/components/Pagination.tsx — fully theme-aware styled-components

import styled, { css } from "styled-components";

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
  border: 1px solid ${(p) => p.theme.colors.border};
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$disabled ? 0.3 : 1)};
  background: ${(p) => p.theme.colors.ghostBg};
  color: ${(p) => p.theme.colors.mutedLight};
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover:not([disabled]) {
    background: ${(p) => p.theme.colors.ghostHoverBg};
    color: ${(p) => p.theme.colors.text};
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
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.normal};

  ${(p) =>
    p.$active
      ? css`
          background: ${p.theme.colors.primary};
          color: white;
          border: none;
          box-shadow: ${p.theme.shadows.glow};
        `
      : css`
          background: ${p.theme.colors.ghostBg};
          color: ${p.theme.colors.mutedLight};
          border: 1px solid ${p.theme.colors.border};
          &:hover { background: ${p.theme.colors.ghostHoverBg}; color: ${p.theme.colors.text}; }
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
