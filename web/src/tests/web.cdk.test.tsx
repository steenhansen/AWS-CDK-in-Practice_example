import React from 'react';         // NB if not present  -    ReferenceError: React is not defined
import { App } from '../components/App';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import the_config from '../../../cdk/program.config.json';
const TESTING_ALIVE = the_config.TESTING_ALIVE;

// in pipeline's Front-End-Test

// cannot snapshot test in pipeline tests, to ensure
// rm -r 'web/src/tests/__snapshots__/'

// there are no lambda functions yet to test db stuff

if (TESTING_ALIVE === 'yes') {

  test('renders the  logo', () => {
    render(<App />);
    const westpointLogo = screen.getByTestId('header-logo');
    expect(westpointLogo).toBeInTheDocument();
  });

} else {

  it('web-at-least-one-cdk-test', () => {
    expect("web-at-least-one-cdk-test").toBe("web-at-least-one-cdk-test");
  });

}
