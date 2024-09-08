import config from '../program.config.json';
const TESTING_ALIVE = config.TESTING_ALIVE;
const AWS_ACCOUNT_Cred = config.AWS_ACCOUNT_Cred;

import constants_config from '../program.constants.json';
const AWS_REGION = constants_config.AWS_REGION;
const DOCKER_OFF_ERROR = constants_config.DOCKER_OFF_ERROR;

import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { TheMainStack } from '../lib/the_main_stack';
describe('Unit Testing Infrastructure.', () => {
  if (TESTING_ALIVE !== 'yes') {
    it('sentinal infra test', () => {
      expect("at-least-one-cdk-test").toBe("at-least-one-cdk-test");
    });
  } else {
    infraTests();
  }
});


function printError(error_mess: string) {
  console.log('\x1b[41m%s\x1b[0m', "**** " + error_mess);
}


function infraTests() {
  describe('Testing Chapter 9 code.', () => {
    test('The stack has a ECS cluster configured in the right way.', () => {
      const app = new App();
      let main_stack: any;
      try {
        main_stack = new TheMainStack(app, 'Chapter9Stack', {
          env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
        });
      } catch (e) {
        printError(DOCKER_OFF_ERROR);
      }
      const template = Template.fromStack(main_stack);
      template.resourceCountIs('AWS::Lambda::Function', 9);
    });


    it('Matches the snapshot.', () => {
      const main_stack = new Stack();

      const the_main_stack = new TheMainStack(main_stack, 'TheMainStack', {
        env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
      });

      const template = Template.fromStack(the_main_stack);
      const the_json = template.toJSON();

      expect(the_json).toMatchSnapshot();
    });



  });

}