//Main.jsx
import React from "react";
import styled from "styled-components";
import RecentArticle from "../molecules/RecentArticle";
import ChatComponent from "../molecules/ChatComponent";
import { MainChatComponent } from "styles/Chat.styled";

const Container = styled.div`
  //width: 114.2rem;
  height: 100%;
  //background-color: tan;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 2.4rem;
`;

const Main = () => {
  return (
    <Container>
      <RecentArticle />
      <MainChatComponent>
      <ChatComponent/>
      </MainChatComponent>
    </Container>
  );
};

export default Main;
