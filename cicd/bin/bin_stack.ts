
import constants_config from '../program.constants.json';

import cdk_config from '../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;
const ACCOUNT_NUMBER = THE_ENVIRONMENTS[WORK_ENV].ACCOUNT_NUMBER;

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { TheMainStack } from '../lib/the_main_stack';
import { ThePipelineStack } from '../lib/the-pipeline-stack';

import { printError } from '../utils/env-errors';

import { aws_iam, Stack } from 'aws-cdk-lib';

const DOCKER_OFF_ERROR = constants_config.DOCKER_OFF_ERROR;

import { stackEnvLabel, stackLabel } from '../utils/construct_labels';

//const getCloudfrontDistributionArn = (account: string, distributionId: string) => `arn:aws:cloudfront::${account}:distribution/${distributionId}`;

const app = new cdk.App();

if (process.env.CDK_MODE === 'ONLY_PIPELINE') {
  try {
    const pipeline_stack = stackLabel('Pipeline-Stack');
    new ThePipelineStack(app, pipeline_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
    });
  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PIPELINE', e.message);
  }
} else {

  const the_stack = stackEnvLabel('Run-Stack');
  try {
    const the_main_stack = new TheMainStack(app, the_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
    });
    console.log("the_main_stack", the_main_stack.s3.distribution);

    // qbertB

    //    https://stackoverflow.com/questions/69821387/cdk-pipelines-use-stack-output-in-poststep-of-stage

    // const cloudfront_id_2_invalidate = the_main_stack.s3.distribution.distributionId;
    // console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ distributionId", the_main_stack.s3.distribution.distributionId);
    // const invalid_cf_arn = `arn:aws:cloudfront::${ACCOUNT_NUMBER}:distribution/${cloudfront_id_2_invalidate}`;
    // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW invalid_cf_arn", invalid_cf_arn);

    // new aws_iam.PolicyStatement({
    //   effect: aws_iam.Effect.ALLOW,
    //   actions: ['cloudfront:GetInvalidation'],
    //   //      resources: [getCloudfrontDistributionArn(Stack.of(the_main_stack).account, the_main_stack.s3.distribution.distributionId)],
    //   resources: [invalid_cf_arn],
    // });



  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PROD', e.message);
  }
}

