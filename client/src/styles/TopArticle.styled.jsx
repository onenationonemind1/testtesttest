import { Box } from "./Article.styled";
import styled from "styled-components";

export const Wrapper = styled(Box)`
  width: ${(props) => props.theme.layout.width.top};
  height: ${(props) => props.theme.layout.height.top};
  border-radius: ${(props) => props.theme.layout.radius.l};
  display: flex;
  justify-content: space-between;
  padding: 0 2.4rem;
  margin: 0 2.8rem;

  & button {
    width: 11.6rem;
    height: 2.8rem;
    border-radius: 0.8rem;
    background-color: #40c3f7;
    box-shadow: inset 0px -1px 0px rgba(64, 195, 247, 0.35),
      inset 0px 1px 0px rgba(255, 255, 255, 0.15);
    filter: drop-shadow(0px 6px 10px rgba(64, 195, 247, 0.25))
      drop-shadow(0px 2px 6px rgba(64, 195, 247, 0.1))
      drop-shadow(0px 1px 3px rgba(64, 195, 247, 0.25));
  }
  &article {
    flex: 1 1 0;
  }

  @media (max-width: ${(props) => props.theme.layout.width.mobileTop}) {
    width: ${(props) => props.theme.layout.width.mobileTop};
    background-color: white;
  }
`;
