
import console = require('console');
import { getSecrets } from '../utils/outsideGitHubSecrets';

import stack_config from '../cloud.config.json';

const domainName = stack_config.DOMAIN_NAME;

const frontendSubdomain = stack_config.DOMAIN_SUB_FRONTEND;
const frontendDevSubdomain = stack_config.DOMAIN_SUB_FRONTEND_DEV;

const backendSubdomain = stack_config.DOMAIN_SUB_BACKEND;
const backendDevSubdomain = stack_config.DOMAIN_SUB_BACKEND_DEV;



const AWS_SECRET_NAME = stack_config.AWS_SECRET_NAME;

const MAIN_BRANCH = stack_config.MAIN_BRANCH;
const DEV_BRANCH = stack_config.DEV_BRANCH;

import { namedDevPipelineLabel, namedProdPipelineLabel } from '../construct_labels';
const namedDevPipeline_label = namedDevPipelineLabel();
const namedProdPipeline_label = namedProdPipelineLabel();


export const pipelineConfig = (env: string) => {
  let prog_info = {
    domainName: domainName,
    backendSubdomain: backendSubdomain,
    frontendSubdomain: frontendSubdomain,
    backendDevSubdomain: backendDevSubdomain,
    frontendDevSubdomain: frontendDevSubdomain,
    AWS_SECRET_NAME: AWS_SECRET_NAME,
    env: env
  };
  const the_secrets_object = getSecrets();
  const {
    SECRET_GITHUB_TOKEN,
    SECRET_PROD_CHANNEL,
    SECRET_DEV_CHANNEL,
    SECRET_WORKSPACE_ID,
    SECRET_SLACK_WEBHOOK
  } = the_secrets_object;

  console.log("secrts", the_secrets_object);

  if (env === 'Prod') {
    const prod_info = {
      buildCommand: 'yarn build-prod',          // for lbrowser  -- lbrowser-build-prod
      deployCommand: 'yarn cdk-prod deploy',   // for cloud
      branch: MAIN_BRANCH,
      tag: namedProdPipeline_label,
    };
    const prod_pipeline = { ...prog_info, ...prod_info };
    return prod_pipeline;
  }

  const dev_info = {
    buildCommand: 'yarn build-prod',             // for lbrowser  --  lbrowser-build-dev
    deployCommand: 'yarn cdk-dev deploy',       // for cloud
    branch: DEV_BRANCH,
    tag: namedDevPipeline_label,
  };
  const dev_pipeline = { ...prog_info, ...dev_info };
  return dev_pipeline;

};

