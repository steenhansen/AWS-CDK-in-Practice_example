import stack_config from '../program.config.json';
import { stackLabel } from '../utils/construct_labels';


const STACK_NAME = stack_config.STACK_NAME;
export const pipelineConfig = (env: string) => {

  if (env === 'Production') {
    const prod_pipe = stackLabel('production-pipeline');
    return {
      buildCommand: 'yarn build:prod', // yarn web-build-prod
      deployCommand: 'yarn cdk deploy', // yarn cdk-prod deploy
      branch: 'main',
      //      tag: 'chap ter9-production-pipeline',
      tag: prod_pipe,
    };
  }

  const dev_pipe = stackLabel('development-pipeline');

  return {
    buildCommand: 'yarn build:dev',        // yarn web-build-dev
    deployCommand: 'yarn cdk:dev deploy',  // yarn cdk-dev
    branch: 'dev',
    //   tag: 'chapt er9-development-pipeline',
    tag: dev_pipe,
  };




};
