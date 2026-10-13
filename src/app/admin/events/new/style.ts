import styled from "styled-components";
import { GlassPanel } from "@/styles/shared";

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

export const FormCard = styled(GlassPanel)`
  padding: 1.75rem;
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }
`;

export const FullWidth = styled.div`
  @media (min-width: ${(p) => p.theme.breakpoints.md}) { grid-column: 1 / -1; }
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: ${(p) => p.theme.colors.mutedLight};
  font-size: 0.875rem;
  font-weight: 500;

  input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: ${(p) => p.theme.colors.primary};
    cursor: pointer;
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;
