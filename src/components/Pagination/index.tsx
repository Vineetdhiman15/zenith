"use client";

import { Wrapper, NavBtn, Pages, PageBtn } from "./style";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

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
