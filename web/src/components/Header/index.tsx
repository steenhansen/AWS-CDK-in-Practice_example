import React from 'react';

import { HeaderContainer } from './styles';

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="brand">
        <a href="/" data-testid={"header-logo"}>DynamoDB colors via Lambdas ... 234</a>
      </div>
    </HeaderContainer>
  );
};
