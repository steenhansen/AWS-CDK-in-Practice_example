
import { SecretValue, Tags } from 'aws-cdk-lib';
import { Artifact, Pipeline, PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import {
  CodeBuildAction,
  GitHubSourceAction,
  GitHubTrigger,
} from 'aws-cdk-lib/aws-codepipeline-actions';
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';

import { Topic } from 'aws-cdk-lib/aws-sns';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { NotificationRule } from 'aws-cdk-lib/aws-codestarnotifications';
import { pipelineConfig } from '../../../utils/pipelineConfig';
import { getSecrets } from '../../../utils/outsideGitHubSecrets';
import { Effect, CompositePrincipal, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

interface Props {
  environment: string;
}

import stack_config from '../../../cloud.config.json';
import console = require("console");
const NODE_RUNTIME = stack_config.NODE_RUNTIME;
const LINUX_VERSION = stack_config.LINUX_VERSION;
const GITHUB_ALIVE = stack_config.GITHUB_ALIVE;
const GITHUB_REPO = stack_config.GITHUB_REPO;
const AWS_REGION = stack_config.AWS_REGION;
const CICD_SLACK_ALIVE = stack_config.CICD_SLACK_ALIVE;
const GITHUB_OWNER = stack_config.GITHUB_OWNER;
const STACK_NAME = stack_config.STACK_NAME;

export class PipelineStack extends Construct {
  readonly frontEndTestProject: PipelineProject;

  readonly backEndTestProject: PipelineProject;

  readonly deployProject: PipelineProject;

  readonly pipeline: Pipeline;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const {
      buildCommand,
      deployCommand,
      branch,
      tag,
      domainName,
      backendSubdomain,
      frontendSubdomain,
      backendDevSubdomain,
      frontendDevSubdomain,
      AWS_SECRET_NAME,
      env
    } = pipelineConfig(props.environment);

    /* ---------- Pipeline Configs ---------- */



    // CodeBuild stage must be able to assume the cdk deploy roles created when bootstrapping the account
    // The role itself must also be assumable by the pipeline in which the stage resides
    const infrastructureDeployRole = new Role(
      this,
      'InfrastructureDeployRole',
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
      }
    );


    const the_secrets_object = getSecrets();
    const {
      SECRET_GITHUB_TOKEN,
      SECRET_PROD_CHANNEL,
      SECRET_DEV_CHANNEL,
      SECRET_WORKSPACE_ID,
      SECRET_SLACK_WEBHOOK
    } = the_secrets_object;

    console.log("secrts", the_secrets_object);
    const secret_github_token = new SecretValue(SECRET_GITHUB_TOKEN);
    console.log("ENV----", env);

    const codeBuildPolicy = new PolicyStatement({
      sid: 'AssumeRole',
      effect: Effect.ALLOW,
      actions: ['sts:AssumeRole', 'iam:PassRole'],
      resources: [
        'arn:aws:iam::*:role/cdk-*',
        // 'arn:aws:iam::*:role/cdk-readOnlyRole',
        // 'arn:aws:iam::*:role/cdk-hnb659fds-lookup-role-*',
        // 'arn:aws:iam::*:role/cdk-hnb659fds-deploy-role-*',
        // 'arn:aws:iam::*:role/cdk-hnb659fds-file-publishing-*',
        // 'arn:aws:iam::*:role/cdk-hnb659fds-image-publishing-role-*',
      ],
    });

    /* ---------- Artifacts ---------- */
    const outputSource = new Artifact();

    /* ---------- Pipeline Build Projects ---------- */
    this.backEndTestProject = new PipelineProject(
      scope,
      `${STACK_NAME}-BackEndTest-PipelineProject-${props.environment}`,
      {
        projectName: `${STACK_NAME}-BackEndTest-PipelineProject-${props.environment}`,
        role: infrastructureDeployRole,
        environment: {
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            LINUX_VERSION,
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              //[Container] 2024/08/23 05:20:28.900301 Running command cd lserver/              
              commands: ['cd lserver/', 'yarn install'],
            },
            build: {
              'on-failure': 'ABORT',
              //[Container] 2024/08/23 05:20:52.064468 Running command echo Testing the Back-End...
              commands: ['echo Testing the Back-End...',
                // 'yarn build-local',    // worse
                'yarn test'],
            },
          },
        }),
      },
    );

    this.deployProject = new PipelineProject(
      this,
      `${STACK_NAME}-BackEndBuild-PipelineProject-${props.environment}`,
      {
        projectName: `${STACK_NAME}-BackEndBuild-PipelineProject-${props.environment}`,
        role: infrastructureDeployRole,
        environment: {
          //  privileged: true,
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            LINUX_VERSION,
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              commands: [
                'cd lbrowser',
                'yarn install',
                `
                echo '{
                  "domain_name": "${domainName}",
                  "backend_subdomain": "${backendSubdomain}",
                  "frontend_subdomain": "${frontendSubdomain}",
                  "backend_dev_subdomain": "${backendDevSubdomain}",
                  "frontend_dev_subdomain": "${frontendDevSubdomain}"
                }' > src/configXXX.json
                `,
                ` echo 'BEFORE 11111111111111111111' `,
                // 'cd ../cloud',
                // 'yarn install',
                // 'cd ../lserver',
                // 'yarn install',
                'cd ../lserver',
                'yarn install',
                'cd ../cloud',
                'yarn install',
                ` echo 'AFTER 222222222222222222222222' `,
              ],
            },
            build: {
              'on-failure': 'ABORT',
              commands: [
                `  echo '000000000000000 BUILD'     `,
                'cd ../lbrowser',
                `${buildCommand}`,  /// 'yarn build-prod',
                `  echo '1111111111111 BUILD'     `,
                'cd ../cloud',
                `  echo '222222222222222 BUILD'     `,
                //                `${deployCommand}`,             //yarn cdk-prod deploy
                `yarn cdk-prod deploy -v`,
                `  echo '3333333333333333 BUILD'     `,
              ],
            },
            post_build: {
              'on-failure': 'ABORT',
              commands: [`  echo '44444444444444444 POST-BUILD'     `],
            },
          },
        }),
      },
    );

    // adding the necessary permissions in order to synthesize and deploy the cdk code.
    this.deployProject.addToRolePolicy(codeBuildPolicy);

    this.frontEndTestProject = new PipelineProject(
      scope,
      `${STACK_NAME}-FrontEndTest-PipelineProject-${props.environment}`,
      {
        projectName: `${STACK_NAME}-FrontEndTest-PipelineProject-${props.environment}`,
        environment: {
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            LINUX_VERSION,
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              commands: ['cd lbrowser/', 'yarn install'],
            },
            build: {
              'on-failure': 'ABORT',
              commands: ['echo Testing the Front-End...', 'yarn test'],
            },
          },
        }),
      },
    );

    if (GITHUB_ALIVE === 'yes') {
      /* ---------- Pipeline ---------- */
      this.pipeline = new Pipeline(scope, `Pipeline-${props.environment}`, {
        pipelineName: `${STACK_NAME}-Pipeline-${props.environment}`,
        role: infrastructureDeployRole,
        pipelineType: PipelineType.V2                        // qbert
      });
      /* ---------- Stages ---------- */
      this.pipeline.addStage({
        stageName: 'Source',
        actions: [
          new GitHubSourceAction({
            actionName: 'Source',
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            branch: `${branch}`,        //   MAIN_BRANCH or DEV_BRANCH
            oauthToken: secret_github_token,
            output: outputSource,
            trigger: GitHubTrigger.WEBHOOK,
          }),
        ],
      });

      this.pipeline.addStage({
        stageName: 'Back-End-Test',
        actions: [
          new CodeBuildAction({
            actionName: 'Back-End-Test',
            project: this.backEndTestProject,
            input: outputSource,
            outputs: undefined,
            role: infrastructureDeployRole
          }),
        ],
      });

      this.pipeline.addStage({
        stageName: 'Front-End-Test',
        actions: [
          new CodeBuildAction({
            actionName: 'Front-End-Test',
            project: this.frontEndTestProject,
            input: outputSource,
            outputs: undefined,
            role: infrastructureDeployRole
          }),
        ],
      });

      this.pipeline.addStage({
        stageName: 'Build-and-Deploy',
        actions: [
          new CodeBuildAction({
            actionName: 'Build-and-Deploy-Front-and-Back-End',
            project: this.deployProject,
            input: outputSource,
            outputs: undefined,
            role: infrastructureDeployRole
          }),
        ],
      });
    }
    console.log('555555555555555555555555 after addStage');
    //   if (CICD_SLACK_ALIVE === 'yes') {
    const snsTopic = new Topic(
      this,
      `${props.environment}-Pipeline-SlackNotificationsTopic`,
    );


    if (env === 'Prod') {
      var channel_id = SECRET_PROD_CHANNEL;
    } else {
      var channel_id = SECRET_DEV_CHANNEL;
    }


    const slackConfig = new SlackChannelConfiguration(this, 'SlackChannel', {
      slackChannelConfigurationName: `${props.environment}-Pipeline-Slack-Channel-Config`,
      slackWorkspaceId: SECRET_WORKSPACE_ID,
      slackChannelId: channel_id,
    });

    const rule = new NotificationRule(this, 'NotificationRule', {
      source: this.pipeline,
      events: [
        'codepipeline-pipeline-pipeline-execution-failed',
        'codepipeline-pipeline-pipeline-execution-canceled',
        'codepipeline-pipeline-pipeline-execution-started',
        'codepipeline-pipeline-pipeline-execution-resumed',
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-manual-approval-needed',
      ],
      targets: [snsTopic],
    });

    rule.addTarget(slackConfig);
    // }
    console.log('666666666666 after slack');
    /* ---------- Tags ---------- */
    Tags.of(this).add('Context', `${tag}`);
  }
};
