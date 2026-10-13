"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { GhostButton, PrimaryButton, Skeleton } from "@/styles/shared";
import {
  Nav, NavInner, LogoLink, LogoIcon, LogoText,
  DesktopNav, NavLink, AuthArea, UserEmail,
  ThemeToggle, HamburgerButton, MobileControls,
  MobileMenu, MobileNavLink, MobileAuthRow,
  MobileSignOutBtn, MobileThemeRow,
} from "./style";

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
        <LogoLink href="/">
          <LogoIcon>CE</LogoIcon>
          <LogoText>Community Events</LogoText>
        </LogoLink>

        <DesktopNav>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} $active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
        </DesktopNav>

        <AuthArea>
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

        <MobileControls>
          <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
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

      {menuOpen && (
        <MobileMenu>
          {navLinks.map((link) => (
            <MobileNavLink
              key={link.href} href={link.href}
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
