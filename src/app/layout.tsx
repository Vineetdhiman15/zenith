// src/app/layout.tsx
import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Community Events Board",
  description:
    "Discover and join local events near you — music nights, workshops, food fairs, sports, and kids events.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ClientShell>{children}</ClientShell>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
