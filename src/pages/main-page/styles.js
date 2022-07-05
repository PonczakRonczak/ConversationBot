import styled from "styled-components";

export const MainPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  height: 50px;
  background-color: #ecb800;
  &div {
    background-color: red;
  }
`;
