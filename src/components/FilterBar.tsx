"use client";
// src/components/FilterBar.tsx — fully styled-components

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { InputField, SelectField } from "@/styles/shared";

interface FilterBarProps {
  category: string;
  city: string;
  search: string;
  onCategoryChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const CITIES = ["Chennai", "Coimbatore", "Bengaluru", "Mumbai", "Hyderabad", "Delhi", "Kolkata"];

// ─── Styled components ────────────────────────────────────────────────────────
const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${theme.breakpoints.sm}) {
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
    color: ${theme.colors.muted};
    pointer-events: none;
    width: 1rem;
    height: 1rem;
  }
`;

const SearchInput = styled(InputField)`
  padding-left: 2.25rem;
`;

const StyledSelect = styled(SelectField)`
  @media (min-width: ${theme.breakpoints.sm}) { width: 11rem; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FilterBar({
  category, city, search,
  onCategoryChange, onCityChange, onSearchChange,
}: FilterBarProps) {
  return (
    <Bar>
      <SearchWrapper>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <SearchInput
          as="input"
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
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
