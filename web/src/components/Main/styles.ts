import styled from 'styled-components';

const MainContainer = styled.header`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: calc(100vh - 86px);

  padding: 48px;

  & > h1 {
    font-weight: 700;
    font-size: 38px;

    margin-bottom: 24px;
  }

  & > p {
    font-weight: 400;
    font-size: 24px;
    line-height: 28px;

    margin-bottom: 24px;

  }

  input:invalid {
  border: red solid 1px;
}
`;

export { MainContainer };


export const BoxedColor = styled.nav`
    background: #010203;

    width: 300px;
    height: 130px;

    padding: 42px;
`;

export const RgbBox = styled.nav`
    background: #ffffff;
   padding: 12px;
`;


export const SpecialColor = styled.nav`
   color: #000;
`;
