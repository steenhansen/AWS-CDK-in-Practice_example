



import { dynamo_post_handler } from '../../cicd/lib/constructs/Lambda/post/routine/';
import { dynamo_get_handler } from '../../cicd/lib/constructs/Lambda/get/routine/';
import { dynamo_clear_handler } from '../../cicd/lib/constructs/Lambda/clear/routine/';


import { printError } from '../../cicd/utils/env-errors';

import the_constants from '../../cicd/program.constants.json';
const CLEARDB_SLUG = the_constants.CLEARDB_SLUG;
const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;

import { healthApp, corsResponse } from './health-app';


function checkNoSqlWork(response_json: any) {
  if (response_json.hasOwnProperty('message')) {
    const err_mess = response_json.message;
    if (err_mess.startsWith("Inaccessible host:")) {
      const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
      printError(error_mess, 'server/src/createApp.ts', err_mess);
    }
  }
}

const createApp = () => {
  const app = healthApp();

  const clear_db = "/" + CLEARDB_SLUG;
  app.get(clear_db, async (_req, res) => {
    try {
      const response = await dynamo_clear_handler();
      const response_json = JSON.stringify(response);
      checkNoSqlWork(response_json);
      return res.status(200).send(response_json);
    } catch (e: unknown) {
      return corsResponse("the_e");
    }
  });

  app.get('/', async (_req, res) => {
    try {
      const response = await dynamo_get_handler();
      const response_json = JSON.parse(response.body);
      checkNoSqlWork(response_json);
      return res.status(200).send(response_json);
    } catch (e: unknown) {
      return corsResponse("the_e");
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
    } catch (e: unknown) {
      return corsResponse("the_e");
    }
  });

  return app;
};
export default createApp;

