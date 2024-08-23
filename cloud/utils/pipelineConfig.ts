
import console = require('console');


import stack_config from '../cloud.config.json';
const CICD_SLACK_ALIVE = stack_config.CICD_SLACK_ALIVE;
const CICD_SLACK_PROD_CHANNEL_ID = stack_config.CICD_SLACK_PROD_CHANNEL_ID;
const CICD_SLACK_DEV_CHANNEL_ID = stack_config.CICD_SLACK_DEV_CHANNEL_ID;
const CICD_SLACK_WORKSPACE_ID_Cred = stack_config.CICD_SLACK_WORKSPACE_ID_Cred;

const domainName = stack_config.DOMAIN_NAME;

const frontendSubdomain = stack_config.DOMAIN_SUB_FRONTEND;
const frontendDevSubdomain = stack_config.DOMAIN_SUB_FRONTEND_DEV;

const backendSubdomain = stack_config.DOMAIN_SUB_BACKEND;
const backendDevSubdomain = stack_config.DOMAIN_SUB_BACKEND_DEV;



const GITHUB_secret_OAuthToken_Cred = stack_config.GITHUB_secret_OAuthToken_Cred;
const GITHUB_ALIVE = stack_config.GITHUB_ALIVE;

const MAIN_BRANCH = stack_config.MAIN_BRANCH;
const DEV_BRANCH = stack_config.DEV_BRANCH;

import { namedDevPipelineLabel, namedProdPipelineLabel } from '../construct_labels';
const namedDevPipeline_label = namedDevPipelineLabel();
const namedProdPipeline_label = namedProdPipelineLabel();


export const pipelineConfig = (env: string) => {

  if (CICD_SLACK_ALIVE === 'yes') {
    if (env === 'Prod') {
      var workspace_id = CICD_SLACK_WORKSPACE_ID_Cred;
      var channel_id = CICD_SLACK_PROD_CHANNEL_ID;
    } else {
      var workspace_id = CICD_SLACK_WORKSPACE_ID_Cred;
      var channel_id = CICD_SLACK_DEV_CHANNEL_ID;
    }
  } else {
    var workspace_id = "DEAD_CICD_SLACK_WORKSPACE_ID_Cred";
    var channel_id = "DEAD_CICD_SLACK_PROD_CHANNEL_ID";
  }
  if (GITHUB_ALIVE === 'yes') {
    var github_token = GITHUB_secret_OAuthToken_Cred;
  } else {
    var github_token = "DEAD_GITHUB_SECRET_OAuthToken";
  }
  let prog_info = {
    domainName: domainName,
    backendSubdomain: backendSubdomain,
    frontendSubdomain: frontendSubdomain,
    backendDevSubdomain: backendDevSubdomain,
    frontendDevSubdomain: frontendDevSubdomain,
    githubToken: github_token,
    workspaceId: workspace_id,
    channelId: channel_id
  };
  if (env === 'Prod') {
    const prod_info = {
      buildCommand: 'yarn build-aws',
      deployCommand: 'yarn cdk-prod deploy',
      branch: MAIN_BRANCH,
      tag: namedProdPipeline_label,
    };
    const prod_pipeline = { ...prog_info, ...prod_info };
    return prod_pipeline;
  }

  const dev_info = {
    buildCommand: 'yarn build-aws',
    deployCommand: 'yarn cdk-dev deploy',
    branch: DEV_BRANCH,
    tag: namedDevPipeline_label,
  };
  const dev_pipeline = { ...prog_info, ...dev_info };
  return dev_pipeline;

};

