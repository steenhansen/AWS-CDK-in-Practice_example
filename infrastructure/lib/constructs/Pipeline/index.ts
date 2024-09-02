

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
import { SSMClient, SSM, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { NotificationRule } from 'aws-cdk-lib/aws-codestarnotifications';
import { pipelineConfig } from '../../../utils/pipelineConfig';
var fs = require('fs');
import * as ssm from 'aws-cdk-lib/aws-ssm';
import console = require("console");
import { stackEnvLabel, stackLabel } from '../../../utils/construct_labels';



interface Props {
  environment: string;
}
import constants_config from '../../../program.constants.json';

const NODE_RUNTIME = constants_config.NODE_RUNTIME;
const LINUX_VERSION = constants_config.LINUX_VERSION;


import stack_config from '../../../program.config.json';
const SSM_SECRETS_NAME = stack_config.SSM_SECRETS_NAME;
const GITHUB_REPO = stack_config.GITHUB_REPO;
const CICD_SLACK_ALIVE = stack_config.CICD_SLACK_ALIVE;
const GITHUB_OWNER = stack_config.GITHUB_OWNER;
const STACK_NAME = stack_config.STACK_NAME;

export class PipelineStack extends Construct {
  readonly frontEndTestProject: PipelineProject;

  readonly backEndTestProject: PipelineProject;

  readonly deployProject: PipelineProject;

  readonly pipeline: Pipeline;

  constructor(scope: Construct, id: string, props: Props) {
    //const node_env = props.environment;
    process.env.NODE_ENV = props.environment;

    super(scope, id);
    const {
      buildCommand,
      deployCommand,
      branch,
      tag,
    } = pipelineConfig(props.environment); //node_env

    /* ---------- Pipeline Configs ---------- */

    const codeBuildPolicy = new PolicyStatement({
      sid: 'AssumeRole',
      effect: Effect.ALLOW,
      actions: ['sts:AssumeRole', 'iam:PassRole'],
      resources: [
        //           'arn:aws:iam::*:role/cdk-*',            qbert
        'arn:aws:iam::*:role/cdk-readOnlyRole',
        'arn:aws:iam::*:role/cdk-hnb659fds-lookup-role-*',
        'arn:aws:iam::*:role/cdk-hnb659fds-deploy-role-*',
        'arn:aws:iam::*:role/cdk-hnb659fds-file-publishing-*',
        'arn:aws:iam::*:role/cdk-hnb659fds-image-publishing-role-*',
      ],
    });

    /* ---------- Artifacts ---------- */
    const outputSource = new Artifact();

    const label_back_test = `BackTest-PipeProj-${props.environment}`;
    const label_back_build = `BackBuild-PipeProj-${props.environment}`;
    const label_front_test = `FrontTest-PipeProj-${props.environment}`;
    const label_the_pipeline = `The-PipeProj-${props.environment}`;

    /* ---------- Pipeline Build Projects ---------- */
    //console.log("YYpipeline-synthYYYYYYYYYY", process.env.NODE_ENV);

    //const back_test = `Ch apter9-BackEndTest-PipelineProject-${props.environment}`;

    const back_test = stackEnvLabel(label_back_test);
    //console.log("XXXXXXXXXXXXXXXXXXX 44444444", back_test, back_test2);



    //const back_name = `Cha pter9-BackEndTest-PipelineProject-${props.environment}`;
    //const back_name = stackEnvLabel(label_back_name);
    //console.log("XXXXXXXXXXXXXXXXXXX 33333333", back_name, back_name2);


    this.backEndTestProject = new PipelineProject(
      scope,
      //      `Chap ter9-BackEndTest-PipelineProject-${props.environment}`,  //  back_test2
      back_test,  //  back_test2
      {
        //     projectName: `Cha pter9-BackEndTest-PipelineProject-${props.environment}`,     //back_name2
        projectName: back_test,     //back_name2
        environment: { buildImage: LinuxBuildImage.fromCodeBuildImageId(LINUX_VERSION) },
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
    // https://us-east-1.console.aws.amazon.com/systems-manager/parameters?region=us-east-1&tab=Table
    // if wrong then re-create the value, delete, then re-create
    const lambda_creds_str = ssm.StringParameter.valueFromLookup(this, SSM_SECRETS_NAME);


    let lambda_creds_obj;
    try {
      lambda_creds_obj = JSON.parse(lambda_creds_str);
    } catch (e) {
      console.log("SSM not ready yet, try again.", e);
      throw "asdflkjsadflkj";
    }
    const {
      GITHUB_TOKEN,
      SLACK_WORKSPACE_ID } = lambda_creds_obj;



    const back_build = stackEnvLabel(label_back_build);
    const temp_SLACK_WEBHOOK = "https://hooks.slack.com/services/A1234567890/B1234567890/C1234567890ABCDEFGHIJKLM";
    const to_infra_pipeline_secrets = "./infrastructure/program.pipeline.json";
    const slack_webhook_k_v_obj = ` { "SECRET_PIPELINE_SLACK_WEBHOOK": "${temp_SLACK_WEBHOOK}" }    `;
    this.deployProject = new PipelineProject(
      this,
      back_build,
      //    `Chapt er9-BackEndBuild-PipelineProject-${props.environment}`,
      {
        //        projectName: `Cha pter9-BackEndBuild-PipelineProject-${props.environment}`,
        projectName: back_build,
        environment: {
          privileged: true,
          buildImage: LinuxBuildImage.fromCodeBuildImageId(LINUX_VERSION)
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
                //                `echo '{ "SECRET_PIPELINE_SLACK_WEBHOOK": "${temp_SLACK_WEBHOOK}" }' > ./infrastructure/program.pipeline.json                     `,
                `echo '${slack_webhook_k_v_obj}' > ${to_infra_pipeline_secrets}      `,
                'cd web',
                'yarn install',
                'cd ../server',
                'yarn install',
                'cd ../infrastructure',
                'yarn install',
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

    //stackLabel
    //    const front_test = stackEnvLabel(label_front_test);
    const front_test = stackLabel(label_front_test);
    this.frontEndTestProject = new PipelineProject(
      scope,
      front_test,
      //    `Chapt er9-FrontEndTest-PipelineProject-${props.environment}`,
      {
        //        projectName: `Cha pter9-FrontEndTest-PipelineProject-${props.environment}`,
        projectName: front_test,
        environment: { buildImage: LinuxBuildImage.fromCodeBuildImageId(LINUX_VERSION) },
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

    const project_pipeline = stackEnvLabel(label_the_pipeline);
    /* ---------- Pipeline ---------- */
    this.pipeline = new Pipeline(scope, `Pipeline-${props.environment}`, {
      //      pipelineName: `Chap ter9-Pipeline-${props.environment}`,
      pipelineName: project_pipeline,
      pipelineType: PipelineType.V2
    });

    const secretToken = new SecretValue(GITHUB_TOKEN);
    /* ---------- Stages ---------- */
    this.pipeline.addStage({
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Source',
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
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


    //   if (CICD_SLACK_ALIVE === 'yes') {


    // const snsTopic = new Topic(
    //   this,
    //   `${props.environment}-Pipeline-SlackNotificationsTopic`,
    // );

    // const slackConfig = new SlackChannelConfiguration(this, 'SlackChannel', {
    //   slackChannelConfigurationName: `${props.environment}-Pipeline-Slack-Channel-Config`,
    //   slackWorkspaceId: SLACK_WORKSPACE_ID || '',
    //   slackChannelId: SLACK_PROD_CHANNEL_ID || '',
    //               //  slackWorkspaceId: workspaceId || '',
    //              //  slackChannelId: channelId || '',
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
