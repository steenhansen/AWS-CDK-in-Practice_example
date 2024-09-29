import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';


import { printConfig } from '../../../utils/env-errors';
import constants_config from '../../../program.constants.json';
import { Str_to_Obj } from '../../../../web/shapes';

const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;
const C_cicd_web_AWS_VALUES_JSON = constants_config.C_cicd_web_AWS_VALUES_JSON;

function pipelineTemplate(cdk_role: Role, pipeline_name: string, aws_pipeline_2_web_vals: Str_to_Obj) {
  const web_constants_k_v_str = JSON.stringify(aws_pipeline_2_web_vals, null, 2);
  const copy_aws_to_web = `   '${web_constants_k_v_str}' > ${C_cicd_web_AWS_VALUES_JSON}  `;
  console.log("\n");
  printConfig("SPECIAL_AWS_NUMBER + SPECIAL_AWS_COLOR Parameters to web ", copy_aws_to_web);
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
            'cd web',
            `echo ${copy_aws_to_web}   `,
            'yarn install',
            'cd ../server',
            'yarn install',
            'cd ../cicd',
            'yarn install']
        },
        build: {
          'on-failure': 'ABORT',
          commands: [
            'cd ../web',
            'yarn web-on-AWS-build',
            'cd ../cicd',
            'yarn cdk deploy']
        },
        post_build: {
          'on-failure': 'ABORT',
          commands: [
            `echo 'pipeline post_build  '   `
          ]
        },
      },
    }),
  };
  return pipeline_structure;
}

export { pipelineTemplate };