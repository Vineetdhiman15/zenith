// src/styled.d.ts
// Extends styled-components DefaultTheme so every p.theme.* is fully typed.

import type { AppTheme } from "@/styles/theme";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
