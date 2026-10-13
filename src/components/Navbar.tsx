"use client";
// src/components/Navbar.tsx — fully styled-components

import Link from "next/link";
import styled, { css } from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { theme } from "@/styles/theme";
import { GhostButton, PrimaryButton, Skeleton } from "@/styles/shared";

// ─── Styled components ────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 10, 20, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${theme.colors.border};
`;

const NavInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  @media (min-width: ${theme.breakpoints.sm}) { padding: 0 1.5rem; }
  @media (min-width: ${theme.breakpoints.lg}) { padding: 0 2rem; }
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
  box-shadow: ${theme.shadows.glow};
  transition: transform ${theme.transitions.normal};
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.sm}) { display: none; }
`;

const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: ${theme.breakpoints.md}) { display: flex; }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${theme.transitions.fast};

  ${(p) =>
    p.$active
      ? css`
          background: ${theme.colors.primary};
          color: white;
        `
      : css`
          color: ${theme.colors.mutedLight};
          &:hover { color: white; background: rgba(255,255,255,0.08); }
        `}
`;

const AuthArea = styled.div`
  display: none;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: ${theme.breakpoints.md}) { display: flex; }
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.muted};

  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: ${theme.colors.mutedLight};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover { color: white; background: rgba(255,255,255,0.08); }

  @media (min-width: ${theme.breakpoints.md}) { display: none; }
`;

const MobileMenu = styled.div`
  border-top: 1px solid ${theme.colors.border};
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (min-width: ${theme.breakpoints.md}) { display: none; }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${theme.transitions.fast};

  ${(p) =>
    p.$active
      ? css`background: ${theme.colors.primary}; color: white;`
      : css`color: ${theme.colors.mutedLight}; &:hover { background: rgba(255,255,255,0.08); color: white; }`}
`;

const MobileAuthRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 0.5rem;
`;

const MobileSignOutBtn = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.mutedLight};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover { background: rgba(255,255,255,0.08); color: white; }
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, logout, loading } = useAuth();
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

        {/* Desktop auth */}
        <AuthArea>
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

        {/* Hamburger */}
        <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </HamburgerButton>
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
