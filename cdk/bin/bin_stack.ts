import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { TheMainStack } from '../lib/the_main_stack';
import { ThePipelineStack } from '../lib/the-pipeline-stack';


import constants_config from '../program.constants.json';
const AWS_REGION = constants_config.AWS_REGION;
const DOCKER_OFF_ERROR = constants_config.DOCKER_OFF_ERROR;

import stack_config from '../program.config.json';
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;
import { stackEnvLabel, stackLabel } from '../utils/construct_labels';

const app = new cdk.App();

function printError(error_mess: string) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}


if (['ONLY_DEV'].includes(process.env.CDK_MODE || '')) {
  process.env.NODE_ENV = 'Env_dvl';
  const dev_stack = stackEnvLabel('Run-Stack');
  try {
    new TheMainStack(app, dev_stack, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    printError(DOCKER_OFF_ERROR);
  }
}

if (['ONLY_PROD'].includes(process.env.CDK_MODE || '')) {
  process.env.NODE_ENV = 'Env_prd';
  const prod_stack = stackEnvLabel('Run-Stack');
  try {
    new TheMainStack(app, prod_stack, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (error: any) {
    printError(DOCKER_OFF_ERROR);
  }
}

if (['ONLY_PIPELINE'].includes(process.env.CDK_MODE || '')) {
  try {
    const pipeline_stack = stackLabel('Pipeline-Stack');
    new ThePipelineStack(app, pipeline_stack, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("eeeeeeeee", e);
    printError(DOCKER_OFF_ERROR);
  }
}
