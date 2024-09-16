import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';
import constants_config from '../../../program.constants.json';
const NODE_RUNTIME = constants_config.NODE_RUNTIME;
const LINUX_VERSION = constants_config.LINUX_VERSION;
const PROG_PIPELINE_JSON = constants_config.PROG_PIPELINE_JSON;

const ON_AWS_WEB_BUILD = constants_config.ON_AWS_WEB_BUILD;
const ON_AWS_CICD_DEPLOY = constants_config.ON_AWS_CICD_DEPLOY;

function pipelineTemplate(cdk_role: Role, pipeline_name: string, SLACK_WEBHOOK: string) {
  //function pipelineTemplate(cdk_role: Role, build_com: string, deploy_com: string, pipeline_name: string, SLACK_WEBHOOK: string) {
  const slack_webhook_k_v_obj = ` { "SECRET_PIPELINE_SLACK_WEBHOOK": "${SLACK_WEBHOOK}" }    `;
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
            `echo '${slack_webhook_k_v_obj}' > ${PROG_PIPELINE_JSON}      `,    // from SystemsManager.ParameterStore
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