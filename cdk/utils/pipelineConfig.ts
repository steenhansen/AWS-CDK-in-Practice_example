import stack_config from '../program.constants.json';
const WEB_BUILD_DEV = stack_config.WEB_BUILD_DEV;
const WEB_BUILD_PROD = stack_config.WEB_BUILD_PROD;
const CDK_DEPLOY_DEV = stack_config.CDK_DEPLOY_DEV;
const CDK_DEPLOY_PROD = stack_config.CDK_DEPLOY_PROD;
const BRANCH_PROD = stack_config.BRANCH_PROD;
const BRANCH_DEV = stack_config.BRANCH_DEV;

import { stackLabel } from '../utils/construct_labels';


export const pipelineConfig = (env: string) => {
  if (env === 'Prod') {
    const prod_pipe = stackLabel('prd-pipeline');
    return {
      buildCommand: WEB_BUILD_PROD,
      deployCommand: CDK_DEPLOY_PROD,
      branch: BRANCH_PROD,
      tag: prod_pipe,
    };
  }

  const dev_pipe = stackLabel('dvl-pipeline');
  return {
    buildCommand: WEB_BUILD_DEV,
    deployCommand: CDK_DEPLOY_DEV,
    branch: BRANCH_DEV,
    tag: dev_pipe,
  };




};
