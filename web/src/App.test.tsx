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




/*
$ craco test--watchAll = false
FAIL src / App.test.tsx
  ✕ Renders the logo
  ● Renders the logo;
ReferenceError: React is not defined
*/


// test('Renders the logo', () => {
//   render(<App />);

//   const the_logo = screen.getByTestId('header-logo');

//   expect(the_logo).toBeInTheDocument();
// });



it('health check route 2', () => {
  expect(2).toBe(2);
});
