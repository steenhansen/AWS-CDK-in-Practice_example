import React from 'react';

import { HeaderContainer } from './styles';

export const Header: React.FunctionComponent = () => {
  return (
    <HeaderContainer>
      <div className="brand">
        <a href="/" data-testid={"header-logo"}>DynamoDB colors via Lambdas</a>
      </div>
    </HeaderContainer>
  );
};
