import { SecretValue, Tags } from 'aws-cdk-lib';
import { Artifact, Pipeline, PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { envLabel, stackLabel } from '../../../utils/construct_labels';
import { pipelineTemplate } from './pipeline-template';
import { backEndTest } from './back-end-test';
import { frontEndTest } from './front-end-test';

import { chatBot } from './chat-bot';

import { sourceStage, backEndStage, frontEndStage, deployStage } from './the-stages';
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;


import { the_cdk_role, code_build_policy, slack_events } from './roles';

import { printConfig, printError } from '../../../utils/env-errors';

import stack_config from '../../../program.config.json';
const C_cicd_SSM_SECRETS_NAME = stack_config.C_cicd_SSM_SECRETS_NAME;



const C_cicd_web_ENVIRON_PRODUCTION = stack_config.C_cicd_web_ENVIRON_PRODUCTION;
const C_cicd_web_ENVIRON_DEVELOP = stack_config.C_cicd_web_ENVIRON_DEVELOP;



import stack_const from '../../../program.constants.json';

const C_cicd_BRANCH_PROD = stack_const.C_cicd_BRANCH_PROD;
const C_cicd_BRANCH_DEV = stack_const.C_cicd_BRANCH_DEV;


interface PipelineProps {
}

export class PipelineStack extends Construct {
    readonly frontEndTestProject: PipelineProject;
    readonly backEndTestProject: PipelineProject;
    readonly deployProject: PipelineProject;
    readonly pipeline: Pipeline;

    constructor(scope: Construct, id: string, props: PipelineProps) {
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

        const lambda_creds_str = ssm.StringParameter.valueFromLookup(this, C_cicd_SSM_SECRETS_NAME);


        let lambda_creds_obj;
        try {
            lambda_creds_obj = JSON.parse(lambda_creds_str);
        } catch (e) {
            printConfig("SSM not ready yet", "Will try again");
            throw "Waiting for SSM to be ready";
        }

        printConfig("If AWS Parameters change then use new name", `C_cicd_SSM_SECRETS_NAME = "lambda-creds7"`);
        printConfig("AWS Parameters ", lambda_creds_obj);
        const {
            GITHUB_TOKEN,
            SLACK_WEBHOOK,
            CHATBOT_PROD_CHANNEL_ID,
            CHATBOT_DEV_CHANNEL_ID,
            CHATBOT_WORKSPACE_ID } = lambda_creds_obj;



        const pipeline_name = stackLabel(label_back_build);


        const aws_pipeline_2_web_vals = { SLACK_WEBHOOK: SLACK_WEBHOOK };
        const pipeline_template = pipelineTemplate(cdk_role, pipeline_name, aws_pipeline_2_web_vals);

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
        if (WORK_ENV === C_cicd_web_ENVIRON_PRODUCTION) {
            env_branch = C_cicd_BRANCH_PROD;
        } else if (WORK_ENV === C_cicd_web_ENVIRON_DEVELOP) {
            env_branch = C_cicd_BRANCH_DEV;
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

        chatBot(this, CHATBOT_PROD_CHANNEL_ID, CHATBOT_DEV_CHANNEL_ID, CHATBOT_WORKSPACE_ID, slack_events);

        Tags.of(this).add('Context', prd_or_dvl_tag);
    }
}
