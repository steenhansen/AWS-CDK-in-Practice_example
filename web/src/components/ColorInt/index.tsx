import React from 'react';

import { Interfaces } from '../../../program.interfaces';

import { UserBox, UserContainer, UserContent } from './styles';

interface Props {
  color_int: Interfaces.ColorInt;
}


export const ColorInt: React.FC<Props> = ({ color_int }) => {
  return (
    <UserContainer key={color_int.the_color}>
      <UserBox>
        <UserContent>
          <li >
            {color_int.the_color} - {color_int.the_integer}
          </li>
        </UserContent>
      </UserBox>
    </UserContainer>
  );
};

