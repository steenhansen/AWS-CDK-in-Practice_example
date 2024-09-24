import React from 'react';

import { ColorInt } from '../../../shapes';


import { UserBox, UserContainer, UserContent } from './styles';

interface BoxProps {
  color_int: ColorInt;
}


export const ColorBox: React.FC<BoxProps> = ({ color_int }) => {
  return (
    <UserContainer key={color_int.the_color}>
      <UserBox>
        <UserContent>
          <li data-testid={"test-" + color_int.the_color}>
            {color_int.the_color} - {color_int.the_integer}
          </li>
        </UserContent>
      </UserBox>
    </UserContainer>
  );
};

