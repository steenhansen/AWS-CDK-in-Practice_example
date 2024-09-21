
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

const app = new cdk.App();


//// ii step4      even when pipeline we must do the MainStack to get the distribution
const the_stack = stackEnvLabel('Run-Stack');
// const the_main_stack = new TheMainStack(app, the_stack, {
//   env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
// });
// console.log("ii444444444444444444444", the_main_stack.s3.distribution.distributionId);




if (process.env.CDK_MODE === 'ONLY_PIPELINE') {
  try {
    const pipeline_stack = stackLabel('Pipeline-Stack');
    new ThePipelineStack(app, pipeline_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
      // s3_cloudFront: the_main_stack.s3.distribution.distributionId
    }
    );
  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PIPELINE', e.message);
  }
} else {


  try {
    const the_main_stack = new TheMainStack(app, the_stack, {
      env: { region: AWS_REGION, account: ACCOUNT_NUMBER },
    });
    console.log("the_main_stack", the_main_stack.s3.distribution);

    // https://github.com/aws/aws-cdk/blob/20a2820ee4d022663fcd0928fbc0f61153ae953f/packages/@aws-cdk/aws-codepipeline-actions/README.md#invalidating-the-cloudfront-cache-when-deploying-to-s3

    // the_main_stack.distribution

    // qbertB

    //    https://stackoverflow.com/questions/69821387/cdk-pipelines-use-stack-output-in-poststep-of-stage

    // const cloudfront_id_2_invalidate = the_main_stack.s3.distribution.distributionId;
    // console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ distribution", the_main_stack.s3.distribution);
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    // //                                                         distributionId: '${Token[TOKEN.207]}',
    // //                          arn:aws:cloudfront::211125473900:distribution/EO16DCP5KEZZA
    // const invalid_cf_arn = `arn:aws:cloudfront::${ACCOUNT_NUMBER}:distribution/${cloudfront_id_2_invalidate}`;
    // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW invalid_cf_arn", invalid_cf_arn);

    // new aws_iam.PolicyStatement({
    //   effect: aws_iam.Effect.ALLOW,
    //   actions: ['cloudfront:GetInvalidation'],
    //   resources: [invalid_cf_arn],
    // });



  } catch (e: any) {
    printError(DOCKER_OFF_ERROR, 'cdk/bin/bin_stack.ts - ONLY_PROD', e.message);
  }
}

