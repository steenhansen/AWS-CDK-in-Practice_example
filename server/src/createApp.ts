



import { dynamo_post_handler } from '../../cicd/lib/constructs/Lambda/post/routine/';
import { dynamo_get_handler } from '../../cicd/lib/constructs/Lambda/get/routine/';
import { dynamo_clear_handler } from '../../cicd/lib/constructs/Lambda/clear/routine/';


import { printError } from '../../cicd/utils/env-errors';

import the_constants from '../../cicd/program.constants.json';
const C_cicd_serv_web_CLEARDB_SLUG = the_constants.C_cicd_serv_web_CLEARDB_SLUG;
const C_cicd_serv_web_NO_SQL_OFF_ERROR = the_constants.C_cicd_serv_web_NO_SQL_OFF_ERROR;
const C_cicd_serv_web_VPN_ON_ERROR = the_constants.C_cicd_serv_web_VPN_ON_ERROR;

import { healthApp, corsResponse } from './health-app';


function checkNoSqlWork(response_json: any) {
  if (response_json.hasOwnProperty('message')) {
    const err_mess = response_json.message;
    if (err_mess.startsWith("Inaccessible host:")) {
      const error_mess = C_cicd_serv_web_NO_SQL_OFF_ERROR + " or " + C_cicd_serv_web_VPN_ON_ERROR;
      printError(error_mess, 'server/src/createApp.ts', err_mess);
    }
  }
}

const createApp = () => {
  const app = healthApp();

  const clear_db = "/" + C_cicd_serv_web_CLEARDB_SLUG;
  app.get(clear_db, async (_req, res) => {
    try {
      const response = await dynamo_clear_handler();
      const response_json = JSON.stringify(response);
      checkNoSqlWork(response_json);
      return res.status(200).send(response_json);
    } catch (e: any) {
      return corsResponse(e.message);
    }
  });

  app.get('/', async (_req, res) => {
    try {
      const response = await dynamo_get_handler();
      const response_json = JSON.parse(response.body);
      checkNoSqlWork(response_json);
      return res.status(200).send(response_json);
    } catch (e: any) {
      return corsResponse(e.message);
    }
  });

  app.post('/', async (req, res) => {
    try {
      const json_data = req.body;
      const string_data = JSON.stringify(json_data);
      const response = await dynamo_post_handler({ body: string_data });
      const response_json = JSON.parse(response.body);
      checkNoSqlWork(response_json);
      return res.status(200).send(response_json);
    } catch (e: any) {
      return corsResponse(e.message);
    }
  });

  return app;
};
export default createApp;

