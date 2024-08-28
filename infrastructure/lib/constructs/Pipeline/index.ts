
/* ---------- External Libraries ---------- */
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
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { NotificationRule } from 'aws-cdk-lib/aws-codestarnotifications';
import { pipelineConfig } from '../../../utils/pipelineConfig';
var fs = require('fs');
import * as ssm from 'aws-cdk-lib/aws-ssm';

interface Props {
  environment: string;
}

import stack_config from '../../../infrastructure.config.json';
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
      githubToken,
      workspaceId,
      channelId,
    } = pipelineConfig(props.environment);

    /* ---------- Pipeline Configs ---------- */
    // const secretToken = new SecretValue(githubToken);

    const codeBuildPolicy = new PolicyStatement({
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
    });

    /* ---------- Artifacts ---------- */
    const outputSource = new Artifact();

    /* ---------- Pipeline Build Projects ---------- */
    this.backEndTestProject = new PipelineProject(
      scope,
      `Chapter9-BackEndTest-PipelineProject-${props.environment}`,
      {
        projectName: `Chapter9-BackEndTest-PipelineProject-${props.environment}`,
        environment: {
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            'aws/codebuild/amazonlinux2-x86_64-standard:5.0',
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME,
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              commands: ['cd server/', 'yarn install'],
            },
            build: {
              'on-failure': 'ABORT',
              commands: ['echo Testing the Back-End...', 'yarn test'],
            },
          },
        }),
      },
    );
    var path = require('path');
    var parentDir = path.resolve(process.cwd());
    console.log("paraent", parentDir);
    const on_local_infrastructure = "../../on-local.infrastructure.config.json";
    let lambda_creds_str;


    if (fs.existsSync(on_local_infrastructure)) {
      lambda_creds_str = fs.readFileSync(on_local_infrastructure, { encoding: 'utf8', flag: 'r' });
      console.log("local", lambda_creds_str);
    } else {


      // https://us-east-1.console.aws.amazon.com/systems-manager/parameters?region=us-east-1&tab=Table
      // if wrong then re-create the value, delete, then re-create
      lambda_creds_str = ssm.StringParameter.valueFromLookup(this, 'lambda-creds');


      console.log("aws", lambda_creds_str);
    }
    const lambda_creds_obj = JSON.parse(lambda_creds_str);
    const {
      GITHUB_TOKEN,
      SLACK_WEBHOOK,
      SLACK_PROD_CHANNEL_ID,
      SLACK_DEV_CHANNEL_ID,
      SLACK_WORKSPACE_ID } = lambda_creds_obj;


    this.deployProject = new PipelineProject(
      this,
      `Chapter9-BackEndBuild-PipelineProject-${props.environment}`,
      {
        projectName: `Chapter9-BackEndBuild-PipelineProject-${props.environment}`,
        environment: {
          privileged: true,
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            'aws/codebuild/amazonlinux2-x86_64-standard:5.0',
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME,
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              commands: [
                `echo ${lambda_creds_str}            `,
                `echo "SLACK_WORKSPACE_ID2", ${SLACK_WORKSPACE_ID}            `,
                'cd web',
                'yarn install',
                `echo '{ "domain_name": "${domainName}",
                         "backend_subdomain": "${backendSubdomain}",
                         "frontend_subdomain": "${frontendSubdomain}",
                         "backend_dev_subdomain": "${backendDevSubdomain}",
                         "frontend_dev_subdomain": "${frontendDevSubdomain}",
                         "SLACK_WEBHOOK": "${SLACK_WEBHOOK}"
                       }' > src/config.json                     `,
                'cd ../server',
                'yarn install',
                'cd ../infrastructure',
                'yarn install',
                `echo '{ "GITHUB_TOKEN": "${GITHUB_TOKEN}",
                         "SLACK_WEBHOOK": "${SLACK_WEBHOOK}",
                         "SLACK_PROD_CHANNEL_ID": "${SLACK_PROD_CHANNEL_ID}",
                         "SLACK_DEV_CHANNEL_ID": "${SLACK_DEV_CHANNEL_ID}",
                         "SLACK_WORKSPACE_ID": "${backendDevSubdomain}"
                       }' > on-aws.infrastructure.config.json                `
              ],
            },
            build: {
              'on-failure': 'ABORT',
              commands: [
                'cd ../web',
                `${buildCommand}`,
                'cd ../infrastructure',
                `${deployCommand}`,
              ],
            },
            post_build: {
              'on-failure': 'ABORT',
              commands: [''],
            },
          },
        }),
      },
    );

    // adding the necessary permissions in order to synthesize and deploy the cdk code.
    this.deployProject.addToRolePolicy(codeBuildPolicy);

    this.frontEndTestProject = new PipelineProject(
      scope,
      `Chapter9-FrontEndTest-PipelineProject-${props.environment}`,
      {
        projectName: `Chapter9-FrontEndTest-PipelineProject-${props.environment}`,
        environment: {
          buildImage: LinuxBuildImage.fromCodeBuildImageId(
            'aws/codebuild/amazonlinux2-x86_64-standard:5.0',
          ),
        },
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: NODE_RUNTIME,
              },
            },
            pre_build: {
              'on-failure': 'ABORT',
              commands: ['cd web/', 'yarn install'],
            },
            build: {
              'on-failure': 'ABORT',
              commands: ['echo Testing the Front-End...', 'yarn test'],
            },
          },
        }),
      },
    );

    /* ---------- Pipeline ---------- */
    this.pipeline = new Pipeline(scope, `Pipeline-${props.environment}`, {
      pipelineName: `Chapter9-Pipeline-${props.environment}`,
      pipelineType: PipelineType.V2
    });

    const secretToken = new SecretValue(githubToken);
    console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJ githubToken=", githubToken);
    console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJ GITHUB_TOKEN=", GITHUB_TOKEN);
    /* ---------- Stages ---------- */
    this.pipeline.addStage({
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Source',
          owner: GITHUB_OWNER,   //'steenhansen',
          repo: GITHUB_REPO,      //'AWS-CDK-in-Practice_example',
          branch: `${branch}`,
          oauthToken: secretToken,
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
        }),
      ],
    });

    // const snsTopic = new Topic(
    //   this,
    //   `${props.environment}-Pipeline-SlackNotificationsTopic`,
    // );

    // const slackConfig = new SlackChannelConfiguration(this, 'SlackChannel', {
    //   slackChannelConfigurationName: `${props.environment}-Pipeline-Slack-Channel-Config`,
    //   slackWorkspaceId: workspaceId || '',
    //   slackChannelId: channelId || '',
    // });

    // const rule = new NotificationRule(this, 'NotificationRule', {
    //   source: this.pipeline,
    //   events: [
    //     'codepipeline-pipeline-pipeline-execution-failed',
    //     'codepipeline-pipeline-pipeline-execution-canceled',
    //     'codepipeline-pipeline-pipeline-execution-started',
    //     'codepipeline-pipeline-pipeline-execution-resumed',
    //     'codepipeline-pipeline-pipeline-execution-succeeded',
    //     'codepipeline-pipeline-manual-approval-needed',
    //   ],
    //   targets: [snsTopic],
    // });

    // rule.addTarget(slackConfig);

    /* ---------- Tags ---------- */
    Tags.of(this).add('Context', `${tag}`);
  }
}
