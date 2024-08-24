import React from 'react';

import { HeaderContainer } from './styles';


let text_logo: string;
if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
  text_logo = 'On Local';
} else {
  text_logo = 'On AWS';
}

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="brand">
        <a href="/" data-testid={"header-logo"}>{text_logo}</a> a1
      </div>
    </HeaderContainer>
  );
};
