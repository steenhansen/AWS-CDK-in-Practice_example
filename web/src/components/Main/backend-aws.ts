
const { C_cicd_web_AWS_Env_prd_dvl,
  C_cicd_web_DOMAIN_PROD_SUB_BACKEND,
  C_cicd_web_DOMAIN_DEV_SUB_BACKEND,
  C_cicd_web_DOMAIN_NAME,
  C_cicd_web_ENVIRON_PRODUCTION,
  C_cicd_web_ENVIRON_DEVELOP,
  //C_cicd_serv_web_CLEARDB_SLUG,
  //C_cicd_serv_web_NO_SQL_OFF_ERROR,
  //C_cicd_serv_web_VPN_ON_ERROR,
  //C_cicd_web_FETCH_TIMEOUT,
  //C_web_SERVER_OFF_ERROR,
  C_cicd_web_SPECIAL_ALIVE,
  //C_serv_web_PORT_SERVER,
  //C_cicd_serv_web_TESTING_ALIVE,
} = require('../../../program.web_values.json');

const { SPECIAL_AWS_COLOR, SPECIAL_AWS_NUMBER
} = require('../../../program.pipeline_2_web.json');


export const backendAWS = () => {
  let backend_url: string;
  let domain_sub_backend = '';
  let SSM_AWS_COLOR = "";
  let SSM_AWS_NUMBER = "";

  if (C_cicd_web_SPECIAL_ALIVE === "yes") {
    if (SPECIAL_AWS_COLOR !== '' && SPECIAL_AWS_NUMBER !== '') {
      SSM_AWS_COLOR = SPECIAL_AWS_COLOR;
      SSM_AWS_NUMBER = SPECIAL_AWS_NUMBER;
    }
  }

  if (C_cicd_web_AWS_Env_prd_dvl === C_cicd_web_ENVIRON_PRODUCTION) {
    domain_sub_backend = C_cicd_web_DOMAIN_PROD_SUB_BACKEND;
  } else if (C_cicd_web_AWS_Env_prd_dvl === C_cicd_web_ENVIRON_DEVELOP) {
    domain_sub_backend = C_cicd_web_DOMAIN_DEV_SUB_BACKEND;
  } else {
    const error_mess = "C_cicd_web_AWS_Env_prd_dvl does not equal Env_prd or Env_dvl";
    console.log(error_mess, 'web/src/components/Main/clear.tsx - doinit()', C_cicd_web_AWS_Env_prd_dvl);
  }
  backend_url = `https://${domain_sub_backend}.${C_cicd_web_DOMAIN_NAME}`;
  return [SSM_AWS_COLOR, SSM_AWS_NUMBER, backend_url];
};