"use client";
import Link from "next/link";
import { PrimaryButton, GhostButton } from "@/styles/shared";
import {
  Hero, Orb, LiveBadge, PingDot, HeroContent, HeroTitle, HeroSubtitle,
  HeroButtons, CategoriesSection, CatHeading, CatGrid, CatCard, CatIcon,
  CatTitle, CatDesc,
} from "./style";

const CATEGORIES = [
  { icon: "🎵", title: "Music",    desc: "Live performances, concerts, and jam sessions near you.",      href: "/events?category=Music"    },
  { icon: "🛠️", title: "Workshop", desc: "Learn new skills with hands-on workshops and bootcamps.",      href: "/events?category=Workshop" },
  { icon: "🍽️", title: "Food",     desc: "Food festivals, pop-ups, and culinary experiences.",            href: "/events?category=Food"     },
  { icon: "🏅", title: "Sports",   desc: "Marathons, tournaments, and fitness events for all levels.",   href: "/events?category=Sports"   },
  { icon: "🎈", title: "Kids",     desc: "Fun, safe, and educational events for children.",               href: "/events?category=Kids"     },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero>
        <Orb $top="25%" $left="20%" $color="rgba(124,58,237,0.18)" />
        <Orb $bottom="20%" $right="15%" $size="20rem" $color="rgba(217,70,239,0.10)" $delay="1.5s" />

        <HeroContent>
          <LiveBadge>
            <PingDot /> Live events in your city
          </LiveBadge>

          <HeroTitle>
            Discover Events That<br />Matter to You
          </HeroTitle>

          <HeroSubtitle>
            Music nights, workshops, food fairs, sports tournaments, and kids
            events — all in one place. Find your next unforgettable experience.
          </HeroSubtitle>

          <HeroButtons>
            <Link href="/events">
              <PrimaryButton style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Browse Events →
              </PrimaryButton>
            </Link>
            <Link href="/auth/signup">
              <GhostButton style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Sign up free
              </GhostButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </Hero>

      <CategoriesSection>
        <CatHeading>What&apos;s On</CatHeading>
        <CatGrid>
          {CATEGORIES.map((c) => (
            <CatCard key={c.title} href={c.href}>
              <CatIcon>{c.icon}</CatIcon>
              <CatTitle>{c.title}</CatTitle>
              <CatDesc>{c.desc}</CatDesc>
            </CatCard>
          ))}
        </CatGrid>
      </CategoriesSection>
    </>
  );
}
