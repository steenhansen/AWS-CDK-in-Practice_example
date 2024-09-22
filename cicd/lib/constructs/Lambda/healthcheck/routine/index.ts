import { httpResponse } from '../../handlers/httpResponse';

import the_constants from '../../../../../program.constants.json';
const C_cicd_serv_HEALTH_CHECK_OK = the_constants.C_cicd_serv_HEALTH_CHECK_OK;

export const healthcheck_handler = async () => {
  try {
    return httpResponse(200, JSON.stringify(C_cicd_serv_HEALTH_CHECK_OK));
  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
