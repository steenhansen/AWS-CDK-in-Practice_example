
import { Effect, CompositePrincipal, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const the_cdk_role =
{
  assumedBy: new CompositePrincipal(
    new ServicePrincipal('codebuild.amazonaws.com'),
    new ServicePrincipal('codepipeline.amazonaws.com')
  ),
  inlinePolicies: {
    CdkDeployPermissions: new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: ['arn:aws:iam::*:role/cdk-*'],
        }),
      ],
    })
  }
};


const slack_events = [
  'codepipeline-pipeline-pipeline-execution-failed',
  'codepipeline-pipeline-pipeline-execution-canceled',
  'codepipeline-pipeline-pipeline-execution-started',
  'codepipeline-pipeline-pipeline-execution-resumed',
  'codepipeline-pipeline-pipeline-execution-succeeded',
  'codepipeline-pipeline-manual-approval-needed'];


const code_build_policy = {
  sid: 'AssumeRole',
  effect: Effect.ALLOW,
  actions: ['sts:AssumeRole', 'iam:PassRole'],
  resources: [
    'arn:aws:iam::*:role/cdk-readOnlyRole',
    'arn:aws:iam::*:role/cdk-hnb659fds-lookup-role-*',
    'arn:aws:iam::*:role/cdk-hnb659fds-deploy-role-*',
    'arn:aws:iam::*:role/cdk-hnb659fds-file-publishing-*',
    'arn:aws:iam::*:role/cdk-hnb659fds-image-publishing-role-*',
  ],
};


export { the_cdk_role, code_build_policy, slack_events };