import { dynamo_post_handler } from '../../cdk/lib/constructs/Lambda/post/routine/';
import { dynamo_get_handler } from '../../cdk/lib/constructs/Lambda/get/routine/';
import { dynamo_clear_handler } from '../../cdk/lib/constructs/Lambda/clear/routine/';

import the_constants from '../../cdk/program.constants.json';
const CLEARDB_SLUG = the_constants.CLEARDB_SLUG;
const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;

import { healthApp, corsResponse } from './health-app';

function printError(error_mess: string) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}

function checkNoSqlWork(response_json: any) {
  if (response_json.hasOwnProperty('message')) {
    const err_mess = response_json.message;
    if (err_mess.startsWith("Inaccessible host:")) {
      const prob_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
      printError(prob_mess);
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

