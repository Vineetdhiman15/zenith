import styled from "styled-components";
import { SelectField } from "@/styles/shared";

export const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;

export const SearchWrapper = styled.div`
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
export const RawSearchInput = styled.input`
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

export const StyledSelect = styled(SelectField)`
  @media (min-width: ${(p) => p.theme.breakpoints.sm}) { width: 11rem; }
`;
