import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: calc(100dvh - 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
`;

export const Code = styled.div`
  font-size: 6rem;
  font-weight: 800;
  background: ${(p) => p.theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.75rem;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 2rem;
  max-width: 28rem;
`;
