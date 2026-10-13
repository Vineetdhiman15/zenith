import styled, { css } from "styled-components";

export const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
`;

export const NavBtn = styled.button<{ $disabled?: boolean }>`
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

export const Pages = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const PageBtn = styled.button<{ $active: boolean }>`
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
