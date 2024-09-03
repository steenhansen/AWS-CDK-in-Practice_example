import React from 'react';

import { HeaderContainer } from './styles';

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="brand">
        <a href="/" data-testid={"header-logo"}>Westpoint 22</a>
      </div>
    </HeaderContainer>
  );
};
