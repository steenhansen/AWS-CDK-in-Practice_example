import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { TheMainStack } from '../lib/the_main_stack';
import stack_config from '../cloud.config.json';
const AWS_REGION = stack_config.AWS_REGION;
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;



describe('Testing cloud code.', () => {


  test('The stack has correct Lambdas.', () => {
    const app = new App();

    const the_main_stack = new TheMainStack(app, 'lambda-tests', {
      env: {
        region: AWS_REGION,
        account: AWS_ACCOUNT_Cred,
      },
    });

    const template = Template.fromStack(the_main_stack);

    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html
    template.resourceCountIs('AWS::Lambda::LayerVersion', 5);

    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_S3.html
    template.resourceCountIs('AWS::S3::Bucket', 2);

    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
    template.resourceCountIs('AWS::DynamoDB::Table', 1);

    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
    template.resourceCountIs('AWS::Lambda::Function', 9);

    const all_lambdas = template.findResources("AWS::Lambda::Function");
    const all_entries = Object.entries(all_lambdas);
    expect(all_entries.filter(([k, v]) => k.match(/DynPost/))).toHaveLength(1);
    expect(all_entries.filter(([k, v]) => k.match(/DynGet/))).toHaveLength(1);
    expect(all_entries.filter(([k, v]) => k.match(/DynClr/))).toHaveLength(1);
  });


  it('Matches the snapshot.', () => {
    const stack = new Stack();

    const the_main_stack = new TheMainStack(stack, 'CloudTestsStack', {
      env: {
        region: AWS_REGION,
        account: AWS_ACCOUNT_Cred,
      },
    });

    const template = Template.fromStack(the_main_stack);

    expect(template.toJSON()).toMatchSnapshot();
  });



});
