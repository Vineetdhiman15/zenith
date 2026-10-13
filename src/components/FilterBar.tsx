"use client";
// src/components/FilterBar.tsx
// Search input is UNCONTROLLED — managed by a ref inside this component.
// This means the parent does NOT re-render on every keystroke, so typing
// is always instant regardless of how heavy the parent is.

import { useRef, useEffect } from "react";
import styled from "styled-components";
import { SelectField } from "@/styles/shared";

interface FilterBarProps {
  category: string;
  city: string;
  // Parent passes the current search string only for imperative resets
  // (e.g. "Clear filters"). It does NOT drive the input value on every keystroke.
  search: string;
  onCategoryChange: (v: string) => void;
  onCityChange: (v: string) => void;
  // Called after a 400ms debounce inside FilterBar — parent sees the final value
  onSearchChange: (v: string) => void;
}

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const CITIES     = ["Chennai", "Coimbatore", "Bengaluru", "Mumbai", "Hyderabad", "Delhi", "Kolkata"];

// ─── Styled components ────────────────────────────────────────────────────────
const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${(p) => p.theme.colors.muted};
    pointer-events: none;
    width: 1rem;
    height: 1rem;
  }
`;

// Plain <input> — NOT extending InputField styled component, so styled-components
// doesn't re-inject styles on every keystroke-triggered re-render.
const RawSearchInput = styled.input`
  width: 100%;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0.625rem 0.875rem 0.625rem 2.25rem;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  font-family: ${(p) => p.theme.fonts.body};
  transition: border-color ${(p) => p.theme.transitions.fast},
              box-shadow    ${(p) => p.theme.transitions.fast};

  &::placeholder { color: ${(p) => p.theme.colors.muted}; }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

const StyledSelect = styled(SelectField)`
  @media (min-width: ${(p) => p.theme.breakpoints.sm}) { width: 11rem; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FilterBar({
  category, city, search,
  onCategoryChange, onCityChange, onSearchChange,
}: FilterBarProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If parent imperatively resets search (e.g. "Clear filters" sets search=""),
  // sync the DOM input without going through React value prop.
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== search) {
      inputRef.current.value = search;
    }
  }, [search]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Input DOM updates instantly — no state, no re-render here.
    const v = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(v), 400);
  };

  return (
    <Bar>
      <SearchWrapper>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <RawSearchInput
          ref={inputRef}
          type="text"
          placeholder="Search events…"
          defaultValue={search}
          onChange={handleInput}
          aria-label="Search events"
          id="filter-search"
        />
      </SearchWrapper>

      <StyledSelect
        value={category}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        id="filter-category"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </StyledSelect>

      <StyledSelect
        value={city}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCityChange(e.target.value)}
        aria-label="Filter by city"
        id="filter-city"
      >
        <option value="">All Cities</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </StyledSelect>
    </Bar>
  );
}
