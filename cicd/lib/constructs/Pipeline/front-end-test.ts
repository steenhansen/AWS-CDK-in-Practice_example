
import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import constants_config from '../../../program.constants.json';
const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;

function frontEndTest(front_test_name: string) {
  const thing = {
    projectName: front_test_name,
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
            'cd web/',
            'yarn install'],
        },
        build: {
          'on-failure': 'ABORT',
          commands: [
            'echo Testing the Front-End',
            'echo                   309',
            'echo .....................',
            'yarn web-test-on-AWS'
          ],
        },
      },
    }),
  };
  return thing;
}

export { frontEndTest };