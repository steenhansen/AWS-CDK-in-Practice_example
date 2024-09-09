import React from 'react';         // NB if not present  -    ReferenceError: React is not defined
import { App } from '../components/App';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import the_config from '../../../cdk/program.config.json';
const TESTING_ALIVE = the_config.TESTING_ALIVE;
import { render, screen, waitFor } from '@testing-library/react';

if (TESTING_ALIVE === 'yes') {

  if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
    snapshotDbTesting();
  } else {
    // in pipeline's Front-End-Test

    // cannot snapshot test in pipeline tests, to ensure
    // rm -r 'web/src/tests/__snapshots__/'

    // there are no lambda functions yet to test db stuff
    it('web-at-least-one-local-test', () => {
      expect("web-at-least-one-local-test").toBe("web-at-least-one-local-test");
    });

  }

} else {

  it('web-at-least-one-local-test', () => {
    expect("web-at-least-one-local-test").toBe("web-at-least-one-local-test");
  });

}




function snapshotDbTesting() {
  it('Web matches the snapshot.', () => {
    const ui_result = render(<App />);
    expect(ui_result).toMatchSnapshot();
  });

  it('clear colors 0 0 0', async () => {
    render(<App />);
    await userEvent.click(screen.getByTestId('test-clear'));
    await screen.findByTestId('test-color_box');
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(0 0 0)');
    });

    await userEvent.type(screen.getByTestId('test-color_rgb'), 'red');
    await userEvent.type(screen.getByTestId('test-color_integer'), '11');
    await userEvent.click(screen.getByTestId('test-change'));
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(11 0 0)');
    });

    await userEvent.type(screen.getByTestId('test-color_rgb'), 'green');
    await userEvent.type(screen.getByTestId('test-color_integer'), '12');
    await userEvent.click(screen.getByTestId('test-change'));
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(11 12 0)');
    });

    await userEvent.type(screen.getByTestId('test-color_rgb'), 'blue');
    await userEvent.type(screen.getByTestId('test-color_integer'), '13');
    await userEvent.click(screen.getByTestId('test-change'));
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(11 12 13)');
    });

    await userEvent.type(screen.getByTestId('test-color_rgb'), 'red');
    await userEvent.type(screen.getByTestId('test-color_integer'), '88');
    await userEvent.click(screen.getByTestId('test-change'));
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(88 12 13)');
    });

    await userEvent.click(screen.getByTestId('test-clear'));
    await screen.findByTestId('test-color_box');
    await waitFor(() => {
      expect(screen.getByTestId('test-color_box')).toHaveTextContent('rgb(0 0 0)');
    });

    expect(screen.getByTestId('test-color_box')).not.toHaveTextContent('ensure-tests-just-not-blindly-passing-as-sync-funcs');

  });
}




