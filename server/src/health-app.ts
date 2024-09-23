
import express from 'express';
import cors from 'cors';

import { healthcheck_handler } from '../../cicd/lib/constructs/Lambda/healthcheck/routine/';
import the_constants from '../../cicd/program.constants.json';
const C_cicd_serv_HEALTH_CHECK_SLUG = the_constants.C_cicd_serv_HEALTH_CHECK_SLUG;
const health_check = "/" + C_cicd_serv_HEALTH_CHECK_SLUG;

export function corsResponse(the_response: string) {
  const cors_resp = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify({ message: the_response }),
  };
  return cors_resp;
}

export const healthApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get(health_check, async (_req, res) => {
    try {
      const response = await healthcheck_handler();
      const response_json = JSON.stringify(response);
      return res.status(200).send(response_json);
    } catch (e: any) {
      return corsResponse(e.message);
    }
  });
  return app;
};
