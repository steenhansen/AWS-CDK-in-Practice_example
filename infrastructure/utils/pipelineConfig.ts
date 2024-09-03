import stack_config from '../program.constants.json';
const WEB_BUILD_DEV = stack_config.WEB_BUILD_DEV;
const WEB_BUILD_PROD = stack_config.WEB_BUILD_PROD;
const CDK_DEPLOY_DEV = stack_config.CDK_DEPLOY_DEV;
const CDK_DEPLOY_PROD = stack_config.CDK_DEPLOY_PROD;
const BRANCH_PROD = stack_config.BRANCH_PROD;
const BRANCH_DEV = stack_config.BRANCH_DEV;

import { stackLabel } from '../utils/construct_labels';


export const pipelineConfig = (env: string) => {
  //  console.log("FFFFFFFFFFFFF", env);
  //  if (env === 'Production') {
  if (env === 'Prod') {
    const prod_pipe = stackLabel('production-pipeline');
    return {
      buildCommand: WEB_BUILD_PROD, ///'yarn build:prod', // yarn web-build-prod
      deployCommand: CDK_DEPLOY_PROD, // 'yarn cdk deploy', // yarn cdk-prod deploy
      branch: BRANCH_PROD,
      //      tag: 'chap ter9-production-pipeline',
      tag: prod_pipe,
    };
  }

  const dev_pipe = stackLabel('development-pipeline');

  return {
    buildCommand: WEB_BUILD_DEV,      //'yarn build:dev',        // yarn web-build-dev
    deployCommand: CDK_DEPLOY_DEV, //'yarn cdk:dev deploy',  // yarn cdk-dev
    branch: BRANCH_DEV,
    //   tag: 'chapt er9-development-pipeline',
    tag: dev_pipe,
  };




};
