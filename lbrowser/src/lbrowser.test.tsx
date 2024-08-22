import { render, screen } from '@testing-library/react';
import { App } from './components/App';
import '@testing-library/jest-dom';

/*
 This crashes without 

  "jest": {
    "moduleNameMapper": {
      "^axios$": "axios/dist/node/axios.cjs"
    }
  },

  in package.json
  
  updating to Jest 29.7.1 did not work
*/


test('Renders the logo', () => {
  render(<App />);

  const the_logo = screen.getByTestId('header-logo');

  expect(the_logo).toBeInTheDocument();
});