import React, { useState } from 'react';

import { ColorInt } from '../../../shapes';


import { CreateColorIntContainer } from './styles';


interface AddClearProps {
  handleAdd: ({
    new_color_int,
  }: {
    new_color_int: ColorInt;
  }) => Promise<void>;

  handleClear: () => Promise<void>;
}

export const CreateColorInt: React.FC<AddClearProps> = ({ handleAdd, handleClear }) => {

  const [new_color_int, setNewColorInt] = useState<ColorInt>({
    id: '',
    the_color: 'purple',
    the_integer: 49
  });

  const handleColorIntChange = (type: string, value: string) => {
    setNewColorInt(current_color_int => ({ ...current_color_int, [type]: value }));
  };




  return (
    <CreateColorIntContainer>
      <span>  red/green/blue</span>&nbsp;
      <input
        autoComplete="off"

        onFocus={({ target }) => target.value = ""}
        onChange={({ target }) => handleColorIntChange('the_color', target.value)}
        type="text"
        name="new_color_int"
        id="new_color_int"
        data-testid={"test-color_rgb"}
        placeholder="red, green, or blue"
      />

      <br /><br />
      <span> 0...255</span>&nbsp;

      <input
        autoComplete="off"
        onFocus={({ target }) => target.value = ""}
        onChange={({ target }) => handleColorIntChange('the_integer', target.value)}
        type="text"
        name="new_color_int"
        id="new_color_int"
        data-testid={"test-color_integer"}
        placeholder="0...255"
      />

      <br />  <br />

      <button type="button" data-testid="test-change" onClick={() => handleAdd({ new_color_int })}>Add or Change</button>

      &nbsp;&nbsp;&nbsp;
      <button type="button"
        onClick={() => handleClear()}
        data-testid="test-clear">
        Clear All 3 rgb
      </button>

    </CreateColorIntContainer>
  );


};
