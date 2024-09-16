import { httpResponse } from '../../handlers/httpResponse';

import the_constants from '../../../../../program.constants.json';
const HEALTH_CHECK_OK = the_constants.HEALTH_CHECK_OK;

export const healthcheck_handler = async () => {
  try {
    return httpResponse(200, JSON.stringify(HEALTH_CHECK_OK));
  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
