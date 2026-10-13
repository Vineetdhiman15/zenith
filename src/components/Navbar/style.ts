// src/components/Navbar/style.ts
import Link from "next/link";
import styled, { css } from "styled-components";

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${(p) => p.theme.colors.navBg};
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${(p) => p.theme.colors.navBorder};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

export const NavInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) { padding: 0 1.5rem; }
  @media (min-width: ${(p) => p.theme.breakpoints.lg}) { padding: 0 2rem; }
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover > div { transform: scale(1.1); }
`;

export const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) => p.theme.shadows.glow};
  transition: transform ${(p) => p.theme.transitions.normal};
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
`;

export const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) { display: none; }
`;

export const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: flex; }
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${(p) => p.theme.transitions.fast};

  ${(p) =>
    p.$active
      ? css`
          background: ${p.theme.colors.primary};
          color: white;
        `
      : css`
          color: ${p.theme.colors.mutedLight};
          &:hover { color: ${p.theme.colors.text}; background: ${p.theme.colors.ghostBg}; }
        `}
`;

export const AuthArea = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: flex; }
`;

export const UserEmail = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};

  @media (max-width: ${(p) => p.theme.breakpoints.lg}) { display: none; }
`;

export const ThemeToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.ghostBg};
  color: ${(p) => p.theme.colors.mutedLight};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-size: 1rem;
  flex-shrink: 0;

  &:hover {
    background: ${(p) => p.theme.colors.ghostHoverBg};
    color: ${(p) => p.theme.colors.text};
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

export const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: ${(p) => p.theme.colors.mutedLight};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover { color: ${(p) => p.theme.colors.text}; background: ${(p) => p.theme.colors.ghostBg}; }
`;

export const MobileControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: none; }
`;

export const MobileMenu = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: ${(p) => p.theme.colors.navBg};
  backdrop-filter: blur(16px);

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: none; }
`;

export const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${(p) => p.theme.transitions.fast};

  ${(p) =>
    p.$active
      ? css`background: ${p.theme.colors.primary}; color: white;`
      : css`color: ${p.theme.colors.mutedLight}; &:hover { background: ${p.theme.colors.ghostBg}; color: ${p.theme.colors.text}; }`}
`;

export const MobileAuthRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  margin-top: 0.5rem;
`;

export const MobileSignOutBtn = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.mutedLight};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover { background: ${(p) => p.theme.colors.ghostBg}; color: ${(p) => p.theme.colors.text}; }
`;

export const MobileThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.mutedLight};
`;
