"use client";
// Search input is UNCONTROLLED — managed by a ref inside this component.
// This means the parent does NOT re-render on every keystroke, so typing
// is always instant regardless of how heavy the parent is.

import { useRef, useEffect } from "react";
import { Bar, SearchWrapper, RawSearchInput, StyledSelect } from "./style";

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
