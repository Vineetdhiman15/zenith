"use client";
// src/components/Navbar.tsx — fully theme-aware styled-components

import Link from "next/link";
import styled, { css } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { GhostButton, PrimaryButton, Skeleton } from "@/styles/shared";

// ─── Styled components ────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${(p) => p.theme.colors.navBg};
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${(p) => p.theme.colors.navBorder};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const NavInner = styled.div`
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

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover > div { transform: scale(1.1); }
`;

const LogoIcon = styled.div`
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

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${(p) => p.theme.breakpoints.sm}) { display: none; }
`;

const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: flex; }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
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

const AuthArea = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: flex; }
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};

  @media (max-width: ${(p) => p.theme.breakpoints.lg}) { display: none; }
`;

// ─── Theme toggle button ──────────────────────────────────────────────────────
const ThemeToggle = styled.button`
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

// ─── Hamburger ────────────────────────────────────────────────────────────────
const HamburgerButton = styled.button`
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

// Wraps the mobile theme-toggle + hamburger — hidden on desktop (AuthArea handles toggle there)
const MobileControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: none; }
`;

const MobileMenu = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: ${(p) => p.theme.colors.navBg};
  backdrop-filter: blur(16px);

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { display: none; }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
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

const MobileAuthRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  margin-top: 0.5rem;
`;

const MobileSignOutBtn = styled.button`
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

const MobileThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.mutedLight};
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/events", label: "Events" },
    ...(user && user.role !== "admin"
      ? [
          { href: "/feed", label: "My Feed" },
          { href: "/settings/categories", label: "Interests" },
        ]
      : []),
    ...(user?.role === "admin"
      ? [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/events", label: "Manage Events" },
          { href: "/admin/events/new", label: "+ New Event" },
        ]
      : []),
  ];

  const sunIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );

  const moonIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  return (
    <Nav>
      <NavInner>
        {/* Logo */}
        <LogoLink href="/">
          <LogoIcon>CE</LogoIcon>
          <LogoText>Community Events</LogoText>
        </LogoLink>

        {/* Desktop links */}
        <DesktopNav>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} $active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
        </DesktopNav>

        {/* Desktop auth + toggle */}
        <AuthArea>
          {/* Theme toggle */}
          <ThemeToggle
            onClick={toggleTheme}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? sunIcon : moonIcon}
          </ThemeToggle>

          {loading ? (
            <Skeleton $height="2rem" $width="5rem" />
          ) : user ? (
            <>
              <UserEmail>{user.email}</UserEmail>
              <GhostButton
                style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                onClick={handleLogout}
              >
                Sign out
              </GhostButton>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <GhostButton style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                  Sign in
                </GhostButton>
              </Link>
              <Link href="/auth/signup">
                <PrimaryButton style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                  Sign up
                </PrimaryButton>
              </Link>
            </>
          )}
        </AuthArea>

        {/* Hamburger + theme toggle — mobile only (desktop uses AuthArea) */}
        <MobileControls>
          <ThemeToggle
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {mode === "dark" ? sunIcon : moonIcon}
          </ThemeToggle>
          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </HamburgerButton>
        </MobileControls>
      </NavInner>

      {/* Mobile menu */}
      {menuOpen && (
        <MobileMenu>
          {navLinks.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              $active={pathname === link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </MobileNavLink>
          ))}

          <MobileThemeRow>
            <span>{mode === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}</span>
            <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
              {mode === "dark" ? sunIcon : moonIcon}
            </ThemeToggle>
          </MobileThemeRow>

          <MobileAuthRow>
            {user ? (
              <MobileSignOutBtn onClick={handleLogout}>
                Sign out ({user.email})
              </MobileSignOutBtn>
            ) : (
              <>
                <Link href="/auth/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  <GhostButton style={{ width: "100%", justifyContent: "center", fontSize: "0.875rem" }}>
                    Sign in
                  </GhostButton>
                </Link>
                <Link href="/auth/signup" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  <PrimaryButton style={{ width: "100%", justifyContent: "center", fontSize: "0.875rem" }}>
                    Sign up
                  </PrimaryButton>
                </Link>
              </>
            )}
          </MobileAuthRow>
        </MobileMenu>
      )}
    </Nav>
  );
}
