import React from 'react';

import { HeaderContainer } from './styles';

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="brand">
        <a href="/" data-testid={"header-logo"}>abcdef 22 44 88 66</a>
      </div>
    </HeaderContainer>
  );
};
