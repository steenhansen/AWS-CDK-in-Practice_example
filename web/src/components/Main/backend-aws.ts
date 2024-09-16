import program_config from '../../../../cicd/program.config.json';

const { SECRET_PIPELINE_SLACK_WEBHOOK, AWS_Env_prd_dvl
} = require('../../../../cicd/program.pipeline.json');

let DOMAIN_PROD_SUB_BACKEND = program_config.DOMAIN_PROD_SUB_BACKEND;
let DOMAIN_DEV_SUB_BACKEND = program_config.DOMAIN_DEV_SUB_BACKEND;
let DOMAIN_NAME = program_config.DOMAIN_NAME;
const ENVIRON_PRODUCTION = program_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = program_config.ENVIRON_DEVELOP;

export const backendAWS = () => {
  let backend_url: string;
  let domain_sub_backend = '';
  let SSM_SLACK_WEBHOOK: string;

  if (SECRET_PIPELINE_SLACK_WEBHOOK !== "") {
    SSM_SLACK_WEBHOOK = SECRET_PIPELINE_SLACK_WEBHOOK;
  } else {
    SSM_SLACK_WEBHOOK = "un-defined";
  }

  if (AWS_Env_prd_dvl === ENVIRON_PRODUCTION) {
    domain_sub_backend = DOMAIN_PROD_SUB_BACKEND;
  } else if (AWS_Env_prd_dvl === ENVIRON_DEVELOP) {
    domain_sub_backend = DOMAIN_DEV_SUB_BACKEND;
  } else {
    const error_mess = "AWS_Env_prd_dvl does not equal Env_prd or Env_dvl";
    console.log(error_mess, 'web/src/components/Main/clear.tsx - doinit()', AWS_Env_prd_dvl);
  }
  backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
  return [SSM_SLACK_WEBHOOK, backend_url];
};