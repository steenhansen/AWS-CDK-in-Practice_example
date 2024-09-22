import React from 'react';         // NB if not present  -    ReferenceError: React is not defined
import { App } from '../components/App';
import '@testing-library/jest-dom';

const { C_cicd_serv_web_TESTING_ALIVE } = require('../../program.pipeline_2_web.json');
import { render, screen, waitFor } from '@testing-library/react';


// in pipeline's Front-End-Test
// cannot snapshot test in pipeline tests gitignore to ensure
// there are no lambda functions yet to test db stuff

if (C_cicd_serv_web_TESTING_ALIVE === 'yes') {

  test('renders the  logo', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
    });
  });

} else {

  it('web-at-least-one-cdk-test', () => {
    expect("web-at-least-one-cdk-test").toBe("web-at-least-one-cdk-test");
  });

}
