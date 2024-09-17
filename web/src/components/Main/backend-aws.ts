

const { AWS_Env_prd_dvl, DOMAIN_PROD_SUB_BACKEND,
  DOMAIN_DEV_SUB_BACKEND,
  DOMAIN_NAME,
  ENVIRON_PRODUCTION,
  ENVIRON_DEVELOP,
  SLACK_WEB_HOOK_ALIVE,
  SECRET_PIPELINE_SLACK_WEBHOOK
} = require('../../../program.pipeline.json');


export const backendAWS = () => {
  let backend_url: string;
  let domain_sub_backend = '';
  let SSM_SLACK_WEBHOOK: string;

  if (SLACK_WEB_HOOK_ALIVE === "yes") {
    SSM_SLACK_WEBHOOK = SECRET_PIPELINE_SLACK_WEBHOOK;
  } else {
    SSM_SLACK_WEBHOOK = "";
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