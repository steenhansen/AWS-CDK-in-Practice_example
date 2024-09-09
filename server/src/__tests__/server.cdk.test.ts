import supertest from 'supertest';
import { describe, expect, it } from '@jest/globals';
import { healthApp } from '../health-app';

import the_constants from '../../../cdk/program.constants.json';
const HEALTH_CHECK_OK = the_constants.HEALTH_CHECK_OK;
const HEALTH_CHECK_SLUG = the_constants.HEALTH_CHECK_SLUG;
const health_check = "/" + HEALTH_CHECK_SLUG;

import the_config from '../../../cdk/program.config.json';
const TESTING_ALIVE = the_config.TESTING_ALIVE;

// in pipeline's Back-End-Test

if (TESTING_ALIVE === 'yes') {

  // this checks the installed but ignored /server on aws

  const app = healthApp();
  describe('health check route', () => {
    it(`Should return status 200 and text: "${HEALTH_CHECK_OK}"`, async () => {
      const super_test = await supertest(app).get(health_check);
      const { statusCode, text } = super_test;
      const the_text = JSON.parse(text);
      expect(statusCode).toBe(200);
      const health_check_ok = `"${HEALTH_CHECK_OK}"`;
      expect(the_text.body).toEqual(health_check_ok);
    });
  });

} else {

  it('server-at-least-one-cdk-test', () => {
    expect("server-at-least-one-cdk-test").toBe("server-at-least-one-cdk-test");
  });

}

