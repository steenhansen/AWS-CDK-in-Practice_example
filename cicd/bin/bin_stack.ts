
import constants_config from '../program.constants.json';


////////////// ksdfj
import cdk_config from '../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;

//////////////////////// ksdfj

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { TheMainStack } from '../lib/the_main_stack';
import { ThePipelineStack } from '../lib/the-pipeline-stack';

import { printError } from '../utils/env-errors';



const DOCKER_OFF_ERROR = constants_config.DOCKER_OFF_ERROR;

import stack_config from '../program.config.json';
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;

import { stackEnvLabel, stackLabel } from '../utils/construct_labels';

const app = new cdk.App();

if (process.env.CDK_MODE === 'ONLY_PIPELINE') {
  try {
    const pipeline_stack = stackLabel('Pipeline-Stack');
    new ThePipelineStack(app, pipeline_stack, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PIPELINE', e.message);
  }
  // } else if (WORK_ENV === 'ONLY_DEV') {
  //   ;
  //   const dev_stack = stackEnvLabel('Run-Stack');
  //   try {
  //     new TheMainStack(app, dev_stack, {
  //       env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
  //     });
  //   } catch (e: any) {
  //     printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_DEV', e.message);
  //   }
} else { //} if (WORK_ENV === 'ONLY_PROD') {

  const the_stack = stackEnvLabel('Run-Stack');
  try {
    new TheMainStack(app, the_stack, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PROD', e.message);
  }
}

