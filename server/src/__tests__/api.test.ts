import create_app from '../createApp';
import the_constants from '../../../cdk/program.constants.json';
const HEALTH_CHECK_OK = the_constants.HEALTH_CHECK_OK;
import supertest from 'supertest';
import { describe, expect, test, it, afterAll } from '@jest/globals';
const HEALTH_CHECK_SLUG = the_constants.HEALTH_CHECK_SLUG;
const health_check = "/" + HEALTH_CHECK_SLUG;



import express from 'express';
import cors from 'cors';
import { healthcheck_handler } from '../../../cdk/lib/constructs/Lambda/healthcheck/routine/';

function corsResponse(the_response: string) {
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


const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const health_check = "/" + HEALTH_CHECK_SLUG;
  app.get(health_check, async (_req, res) => {
    try {
      const response = await healthcheck_handler();
      const response_json = JSON.stringify(response);
      return res.status(200).send(response_json);
    } catch (e: unknown) {
      return corsResponse("the_e");
    }
  });



  return app;
};



const app = createApp();
describe('health check route', () => {
  it('Should return status 200 and text: "${HEALTH_CHECK_OK}"', async () => {
    const super_test = await supertest(app).get(health_check);  //'/health');
    const { statusCode, text } = super_test;
    const the_text = JSON.parse(text);
    expect(statusCode).toBe(200);
    const health_check_ok = `"${HEALTH_CHECK_OK}"`;
    expect(the_text.body).toEqual(health_check_ok);
  });
});

