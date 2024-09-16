import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';
import constants_config from '../../../program.constants.json';
const NODE_RUNTIME = constants_config.NODE_RUNTIME;
const LINUX_VERSION = constants_config.LINUX_VERSION;
const PROG_PIPELINE_JSON = constants_config.PROG_PIPELINE_JSON;

const CLEARDB_SLUG = constants_config.CLEARDB_SLUG;
const ON_AWS_WEB_BUILD = constants_config.ON_AWS_WEB_BUILD;
const ON_AWS_CICD_DEPLOY = constants_config.ON_AWS_CICD_DEPLOY;

import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

import program_config from '../../../program.config.json';
let DOMAIN_PROD_SUB_BACKEND = program_config.DOMAIN_PROD_SUB_BACKEND;
let DOMAIN_DEV_SUB_BACKEND = program_config.DOMAIN_DEV_SUB_BACKEND;
let DOMAIN_NAME = program_config.DOMAIN_NAME;
const ENVIRON_PRODUCTION = program_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = program_config.ENVIRON_DEVELOP;
const SLACK_WEB_HOOK_ALIVE = program_config.SLACK_WEB_HOOK_ALIVE;

function pipelineTemplate(cdk_role: Role, pipeline_name: string, SLACK_WEBHOOK: string) {
  const slack_webhook_k_v_obj =
  {
    AWS_Env_prd_dvl: WORK_ENV,
    DOMAIN_PROD_SUB_BACKEND: DOMAIN_PROD_SUB_BACKEND,
    DOMAIN_DEV_SUB_BACKEND: DOMAIN_DEV_SUB_BACKEND,
    DOMAIN_NAME: DOMAIN_NAME,
    ENVIRON_PRODUCTION: ENVIRON_PRODUCTION,
    ENVIRON_DEVELOP: ENVIRON_DEVELOP,
    CLEARDB_SLUG: CLEARDB_SLUG,
    SLACK_WEB_HOOK_ALIVE: SLACK_WEB_HOOK_ALIVE,
    SECRET_PIPELINE_SLACK_WEBHOOK: "_SLACK_WEBHOOK_"
  };
  const slack_webhook_k_v_str = JSON.stringify(slack_webhook_k_v_obj, null, 2);;
  const pipeline_structure = {
    projectName: pipeline_name,
    role: cdk_role,
    environment: { privileged: true, buildImage: LinuxBuildImage.fromCodeBuildImageId(LINUX_VERSION) },
    buildSpec: BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: { 'runtime-versions': { nodejs: NODE_RUNTIME } },
        pre_build: {
          'on-failure': 'ABORT',
          commands: [
            `echo '${slack_webhook_k_v_str}' > ${PROG_PIPELINE_JSON}      `,    // from SystemsManager.ParameterStore
            'cd web',
            'yarn install',
            'cd ../server',
            'yarn install',
            'cd ../cicd',
            'yarn install']
        },
        build: {
          'on-failure': 'ABORT',
          commands: ['cd ../web',
            ON_AWS_WEB_BUILD,
            'cd ../cicd',
            ON_AWS_CICD_DEPLOY]
        },
        post_build: { 'on-failure': 'ABORT', commands: [''] },
      },
    }),
  };
  return pipeline_structure;
}

export { pipelineTemplate };