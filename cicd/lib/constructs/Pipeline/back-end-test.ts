
import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';
import constants_config from '../../../program.constants.json';
const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;

function backEndTest(cdk_role: Role, back_test_name: string) {
  const thing = {
    projectName: back_test_name,
    role: cdk_role,
    environment: { buildImage: LinuxBuildImage.fromCodeBuildImageId(C_cicd_LINUX_VERSION) },
    buildSpec: BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          'runtime-versions': {
            nodejs: C_cicd_NODE_RUNTIME,
          },
        },
        pre_build: {
          'on-failure': 'ABORT',
          commands: [
            'cd server/',
            'yarn install'],
        },
        build: {
          'on-failure': 'ABORT',
          commands: [
            'echo Testing the Back-End...',
            'yarn server-test-AWS'
          ],
        },
      },
    }),
  };
  return thing;
}

export { backEndTest };