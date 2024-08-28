import * as dotenv from 'dotenv';
import config from '../../config.json';
var fs = require('fs');

import stack_config from '../infrastructure.config.json';

const domainName = stack_config.DOMAIN_NAME;

const frontendSubdomain = stack_config.DOMAIN_SUB_FRONTEND;
const frontendDevSubdomain = stack_config.DOMAIN_SUB_FRONTEND_DEV;

const backendSubdomain = stack_config.DOMAIN_SUB_BACKEND;
const backendDevSubdomain = stack_config.DOMAIN_SUB_BACKEND_DEV;



const AWS_SECRET_NAME = stack_config.AWS_SECRET_NAME;

const MAIN_BRANCH = stack_config.MAIN_BRANCH;
const DEV_BRANCH = stack_config.DEV_BRANCH;



const webConfigJSON = {
  domainName: config.domain_name,
  backendSubdomain: config.backend_subdomain,
  frontendSubdomain: config.frontend_subdomain,
  backendDevSubdomain: config.backend_dev_subdomain,
  frontendDevSubdomain: config.frontend_dev_subdomain,
};
interface OutsideSecrets {
  GITHUB_TOKEN: string;
  SLACK_WEBHOOK: string;
  SLACK_PROD_CHANNEL_ID: string;
  SLACK_DEV_CHANNEL_ID: string;
  SLACK_WORKSPACE_ID: string;
}


export const pipelineConfig = (env: string) => {

  if (env === 'Production') {
    const { parsed } = dotenv.config({ path: '.env.production' });

    return {
      buildCommand: 'yarn build:prod',
      deployCommand: 'yarn cdk deploy',
      branch: 'main',
      tag: 'chapter9-production-pipeline',
      githubToken: parsed?.GITHUB_TOKEN,
      workspaceId: parsed?.WORKSPACE_ID,
      channelId: parsed?.CHANNEL_ID,
      ...webConfigJSON,
    };
  }

  const { parsed } = dotenv.config({ path: '.env.development' });

  return {
    buildCommand: 'yarn build:dev',
    deployCommand: 'yarn cdk:dev deploy',
    branch: 'dev',
    tag: 'chapter9-development-pipeline',
    githubToken: parsed?.GITHUB_TOKEN,
    workspaceId: parsed?.WORKSPACE_ID,
    channelId: parsed?.CHANNEL_ID,
    ...webConfigJSON,
  };




};
