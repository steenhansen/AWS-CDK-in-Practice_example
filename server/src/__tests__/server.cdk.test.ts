
import { describe, expect, it } from '@jest/globals';
import { healthApp } from '../health-app';

import supertest from 'supertest';
const { C_cicd_serv_HEALTH_CHECK_OK, C_cicd_serv_HEALTH_CHECK_SLUG } = require('../../../cicd/program.constants.json');
const { C_cicd_serv_web_REAL_TESTS_ALIVE } = require('.../../../cicd/program.switches.json');
const health_check = "/" + C_cicd_serv_HEALTH_CHECK_SLUG;

const app = healthApp();

if (C_cicd_serv_web_REAL_TESTS_ALIVE === 'yes') {

  const health_check_ok = `"${C_cicd_serv_HEALTH_CHECK_OK}"`;

  describe('health check route', () => {
    it('Should return status 200 and message: {status: "available"}', async () => {
      const { text, statusCode } = await supertest(app).get(health_check);
      const the_text = JSON.parse(text);
      expect(statusCode).toBe(200);
      expect(the_text.body).toEqual(health_check_ok);
    });
  });

} else {

  it('server-at-least-one-cdk-test', () => {
    expect("server-at-least-one-cdk-test").toBe("server-at-least-one-cdk-test");
  });

}

