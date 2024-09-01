
export const pipelineConfig = (env: string) => {

  if (env === 'Production') {

    return {
      buildCommand: 'yarn build:prod', // yarn web-build-prod
      deployCommand: 'yarn cdk deploy', // yarn cdk-prod deploy
      branch: 'main',
      tag: 'chapter9-production-pipeline',
    };
  }


  return {
    buildCommand: 'yarn build:dev',        // yarn web-build-dev
    deployCommand: 'yarn cdk:dev deploy',  // yarn cdk-dev
    branch: 'dev',
    tag: 'chapter9-development-pipeline',
  };




};
