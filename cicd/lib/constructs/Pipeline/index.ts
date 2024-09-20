


import { aws_cloudfront, aws_codebuild, aws_codepipeline, aws_codepipeline_actions, aws_s3, RemovalPolicy } from 'aws-cdk-lib';
import { CloudfrontInvalidation } from './cloudfront-invalidation';

import { SecretValue, Tags } from 'aws-cdk-lib';
import { Artifact, Pipeline, PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { NotificationRule } from 'aws-cdk-lib/aws-codestarnotifications';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import console = require("console");
import { envLabel, stackLabel } from '../../../utils/construct_labels';
import { pipelineTemplate } from './pipeline-template';
import { backEndTest } from './back-end-test';
import { frontEndTest } from './front-end-test';
import { sourceStage, backEndStage, frontEndStage, deployStage } from './the-stages';
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;


import { the_cdk_role, code_build_policy, slack_events } from './roles';
interface Props {
}
import { printError } from '../../../utils/env-errors';

import stack_config from '../../../program.config.json';
const SSM_SECRETS_NAME = stack_config.SSM_SECRETS_NAME;
const CICD_SLACK_ALIVE = stack_config.CICD_SLACK_ALIVE;


const ENVIRON_PRODUCTION = stack_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = stack_config.ENVIRON_DEVELOP;



import stack_const from '../../../program.constants.json';

const BRANCH_PROD = stack_const.BRANCH_PROD;
const BRANCH_DEV = stack_const.BRANCH_DEV;





export class PipelineStack extends Construct {
    readonly frontEndTestProject: PipelineProject;
    readonly backEndTestProject: PipelineProject;
    readonly deployProject: PipelineProject;
    readonly pipeline: Pipeline;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const prd_or_dvl_tag = stackLabel('prd-pipeline');
        const cdk_role = new Role(this, 'cdk_role', the_cdk_role);
        const codeBuildPolicy = new PolicyStatement(code_build_policy);

        const label_back_test = envLabel('BackTest-PipeProj');         // Prod or Dev
        const label_back_build = envLabel('BackBuild-PipeProj');
        const label_front_test = envLabel('FrontTest-PipeProj');
        const label_the_pipeline = envLabel('The-PipeProj');



        const back_test_name = stackLabel(label_back_test);
        const back_end_test = backEndTest(cdk_role, back_test_name);
        this.backEndTestProject = new PipelineProject(scope, back_test_name, back_end_test);

        const lambda_creds_str = ssm.StringParameter.valueFromLookup(this, SSM_SECRETS_NAME);


        let lambda_creds_obj;
        try {
            lambda_creds_obj = JSON.parse(lambda_creds_str);
        } catch (e) {
            console.log("SSM not ready yet, try again.", e);
            throw "asdflkjsadflkj";
        }

        const {
            GITHUB_TOKEN, SLACK_WEBHOOK,
            SLACK_PROD_CHANNEL_ID,
            SLACK_WORKSPACE_ID } = lambda_creds_obj;

        const pipeline_name = stackLabel(label_back_build);

        const pipeline_template = pipelineTemplate(cdk_role, pipeline_name, SLACK_WEBHOOK);

        this.deployProject = new PipelineProject(this, pipeline_name, pipeline_template);
        this.deployProject.addToRolePolicy(codeBuildPolicy);

        const front_test = stackLabel(label_front_test);
        const front_template = frontEndTest(front_test);
        this.frontEndTestProject = new PipelineProject(scope, front_test, front_template);

        const project_pipeline = stackLabel(label_the_pipeline);
        this.pipeline = new Pipeline(scope,
            project_pipeline,
            {
                pipelineName: project_pipeline,
                role: cdk_role,
                pipelineType: PipelineType.V2
            });

        const secretToken = new SecretValue(GITHUB_TOKEN);
        const outputSource = new Artifact();


        let env_branch = '';
        if (WORK_ENV === ENVIRON_PRODUCTION) {
            env_branch = BRANCH_PROD;
        } else if (WORK_ENV === ENVIRON_DEVELOP) {
            env_branch = BRANCH_DEV;
        } else {
            printError("WORK_ENV <> 'Env_prd' nor 'Env_dvl' ", 'cdk/lib/constructs/API-GW/', `NODE_ENV="${WORK_ENV}"`);
        }


        const source_stage = sourceStage(outputSource, secretToken, env_branch);
        this.pipeline.addStage(source_stage);

        const back_end_stage = backEndStage(this.backEndTestProject, outputSource, cdk_role);
        this.pipeline.addStage(back_end_stage);

        const front_stage = frontEndStage(this.frontEndTestProject, outputSource, cdk_role);
        this.pipeline.addStage(front_stage);

        const deploy_stage = deployStage(this.deployProject, outputSource, cdk_role);
        this.pipeline.addStage(deploy_stage);

        //   if (props.cloudfrontDistribution) { // qbert2
        //  https://medium.com/@eldhomaniabraham/aws-lambda-function-for-automating-cloudfront-invalidation-from-codepipeline-cd57649f0ab5


        // const cloudfront = new aws.CloudFront();
        // const response = await cloudfront.createInvalidation({
        //     DistributionId,
        //     InvalidationBatch: {
        //         CallerReference: `${Date.now()}`,
        //         Paths: {
        //             Items: ["/*"],
        //             Quantity: 1
        //         }
        //     }
        // }).promise();


        // this.pipeline.addStage({
        //     stageName: 'Invalidation',
        //     actions: [
        //         new aws_codepipeline_actions.StepFunctionInvokeAction({
        //             actionName: 'StepFunctionInvokeAction',
        //             stateMachine: new CloudfrontInvalidation(this, 'CloudfrontInvalidation', { cloudfrontDistribution: props.cloudfrontDistribution })
        //                 .stateMachine,
        //         }),
        //     ],
        // });
        //    }


        if (CICD_SLACK_ALIVE === 'yes') {
            const slack_topic_name = envLabel('Pipeline-SlackNotificationsTopic');
            const pipeline_slack_config = envLabel('Pipeline-Slack-Channel-Config');
            const snsTopic = new Topic(this, slack_topic_name);
            const slackConfig = new SlackChannelConfiguration(this, 'SlackChannel', {
                slackChannelConfigurationName: pipeline_slack_config,
                slackWorkspaceId: SLACK_WORKSPACE_ID,
                slackChannelId: SLACK_PROD_CHANNEL_ID
            });
            const rule = new NotificationRule(this, 'SlackNotificationRule', {
                source: this.pipeline,
                events: slack_events,
                targets: [snsTopic],
            });
            rule.addTarget(slackConfig);
        }

        Tags.of(this).add('Context', prd_or_dvl_tag);
    }
}
