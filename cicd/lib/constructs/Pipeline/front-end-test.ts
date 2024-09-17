
import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import constants_config from '../../../program.constants.json';
const NODE_RUNTIME = constants_config.NODE_RUNTIME;
const LINUX_VERSION = constants_config.LINUX_VERSION;

function frontEndTest(front_test_name: string) {
  const thing = {
    projectName: front_test_name,
    environment: { buildImage: LinuxBuildImage.fromCodeBuildImageId(LINUX_VERSION) },
    buildSpec: BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          'runtime-versions': {
            nodejs: NODE_RUNTIME,
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
            'echo Testing the Front-End...',
            'yarn web-test-AWS'
          ],
        },
      },
    }),
  };
  return thing;
}

export { frontEndTest };