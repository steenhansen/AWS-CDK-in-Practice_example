import styled from "styled-components";

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  input[type="checkbox"] {
    margin-top: 10px;
    margin-right: 12px;

    align-self: flex-start;

    width: 25px;
    height: 25px;

    
  }
`;

const UserBox = styled.div`
  display: flex;

  padding: 8px 16px;
/* border: 1px solid rgba(0, 0, 0, 0.2); */
  border-radius: 8px;
  
  flex: 1;

  h1 {
    font-size: 24px;
    line-height: 28px;
  }

  p {
    font-size: 22px;
    line-height: 26px;
  }
`;

const UserContent = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
`;



export { UserContainer, UserBox, UserContent };