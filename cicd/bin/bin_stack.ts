
import constants_config from '../program.constants.json';

import cdk_config from '../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

import { Str_to_Obj } from '../../web/shapes';


const THE_ENVIRONMENTS: Str_to_Obj = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;
const ACCOUNT_NUMBER = THE_ENVIRONMENTS[WORK_ENV].ACCOUNT_NUMBER;

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { TheMainStack } from '../lib/the_main_stack';
import { ThePipelineStack } from '../lib/the-pipeline-stack';

import { printError } from '../utils/env-errors';



const C_cicd_DOCKER_OFF_ERROR = constants_config.C_cicd_DOCKER_OFF_ERROR;


import { stackEnvLabel, stackLabel } from '../utils/construct_labels';

const app = new cdk.App();

if (process.env.CDK_MODE === 'ONLY_PIPELINE') {
  const pipeline_stack = stackLabel('Pipeline-Stack');
  try {
    new ThePipelineStack(app, pipeline_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
    });
  } catch (e: any) {
    printError(C_cicd_DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PIPELINE', e.message);
  }
} else {
  const the_stack = stackEnvLabel('Run-Stack');
  try {
    new TheMainStack(app, the_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
    });
  } catch (e: any) {
    printError(C_cicd_DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PROD', e.message);
  }
}

