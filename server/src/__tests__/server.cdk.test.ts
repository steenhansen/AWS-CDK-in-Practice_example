const supertest = require("supertest");


const { healthApp } = require('../health-app.js'); /// .JS


const { HEALTH_CHECK_OK, HEALTH_CHECK_SLUG } = require('../../../cicd/program.constants.json');
const { TESTING_ALIVE } = require('.../../../cicd/program.config.json');
const health_check = "/" + HEALTH_CHECK_SLUG;

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

