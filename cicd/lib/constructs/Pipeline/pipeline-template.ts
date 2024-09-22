import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';



import constants_config from '../../../program.constants.json';

import web_constants from '../../../program.constants.json';
import web_configs from '../../../program.config.json';
import web_switches from '../../../program.switches.json';
import { getConfigConstants } from '../../../utils/getWebConsts';


const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;
const C_cicd_PROG_PIPELINE_JSON = constants_config.C_cicd_PROG_PIPELINE_JSON;

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