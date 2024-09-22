import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';



import constants_config from '../../../program.constants.json';

let web_constants = require('../../../program.constants.json');
let web_configs = require('../../../program.config.json');
let web_switches = require('../../../program.switches.json');

const getConfigConstants = require('../../../utils/getWebConsts');

const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;
const C_cicd_PROG_PIPELINE_JSON = constants_config.C_cicd_PROG_PIPELINE_JSON;

//const C_cicd_serv_web_CLEARDB_SLUG = constants_config.C_cicd_serv_web_CLEARDB_SLUG;
//const C_cicd_ON_AWS_WEB_BUILD = constants_config.C_cicd_ON_AWS_WEB_BUILD;
//const C_cicd_ON_AWS_CICD_DEPLOY = constants_config.C_cicd_ON_AWS_CICD_DEPLOY;

//import cdk_config from '../../../cdk.json';
//const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

//import program_config from '../../../program.config.json';
//let C_cicd_web_DOMAIN_PROD_SUB_BACKEND = program_config.C_cicd_web_DOMAIN_PROD_SUB_BACKEND;
//let C_cicd_web_DOMAIN_DEV_SUB_BACKEND = program_config.C_cicd_web_DOMAIN_DEV_SUB_BACKEND;
//let C_cicd_web_DOMAIN_NAME = program_config.C_cicd_web_DOMAIN_NAME;
//const C_cicd_web_ENVIRON_PRODUCTION = program_config.C_cicd_web_ENVIRON_PRODUCTION;
//const C_cicd_web_ENVIRON_DEVELOP = program_config.C_cicd_web_ENVIRON_DEVELOP;
//const GLOBAL_WEB_VAR = program_config.GLOBAL_WEB_VAR;

//import program_switches from '../../../program.switches.json';
//const C_cicd_web_SLACK_WEB_HOOK_ALIVE = program_switches.C_cicd_web_SLACK_WEB_HOOK_ALIVE;
//const C_cicd_serv_web_TESTING_ALIVE = program_switches.C_cicd_serv_web_TESTING_ALIVE;


function pipelineTemplate(cdk_role: Role, pipeline_name: string, SLACK_WEBHOOK: string) {
  let aws_to_web_constants = getConfigConstants(web_constants, web_configs, web_switches);
  aws_to_web_constants["C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK"] = SLACK_WEBHOOK;

  const web_constants_k_v_str = JSON.stringify(aws_to_web_constants, null, 2);;
  const pipeline_structure = {
    projectName: pipeline_name,
    role: cdk_role,
    environment: { privileged: true, buildImage: LinuxBuildImage.fromCodeBuildImageId(C_cicd_LINUX_VERSION) },
    buildSpec: BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: { 'runtime-versions': { nodejs: C_cicd_NODE_RUNTIME } },
        pre_build: {
          'on-failure': 'ABORT',
          commands: [
            `echo '${web_constants_k_v_str}' > ${C_cicd_PROG_PIPELINE_JSON}      `,    // from SystemsManager.ParameterStore
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
            'yarn web-build-AWS',
            'cd ../cicd',
            'yarn cdk deploy']
        },
        post_build: { 'on-failure': 'ABORT', commands: [''] },
      },
    }),
  };
  return pipeline_structure;
}

export { pipelineTemplate };