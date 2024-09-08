import create_app from '../createApp';
import the_constants from '../../../cdk/program.constants.json';
const HEALTH_CHECK_OK = the_constants.HEALTH_CHECK_OK;
import supertest from 'supertest';
import { describe, expect, test, it, afterAll } from '@jest/globals';


const HEALTH_CHECK_SLUG = the_constants.HEALTH_CHECK_SLUG;
const health_check = "/" + HEALTH_CHECK_SLUG;

const PORT_TEST = 3007;  //constants_config.PORT_TEST;

let server: any;
const app = create_app();
try {
  server = app.listen(PORT_TEST, () => {
    //console.info(`Test server is listening on port ${PORT_TEST}`);
  });
  //throw "Error: listen EACCES: permission denied 0.0.0.0:3003";
} catch (e) {
  const my_arr = [e,
    "If above error is 'Error: listen EACCES: permission denied 0.0.0.0:3003' ",
    "   and on Windows then clear stuck ports with",
    "net stop winnat",
    "net start winnat"];
  console.log(my_arr);
}

server.keepAliveTimeout = 10;
server.headersTimeout = 10;
create_app();

describe('health check route', () => {
  it('Should return status 200 and text: "${HEALTH_CHECK_OK}"', async () => {
    const super_test = await supertest(app).get(health_check);  //'/health');
    const { statusCode, text } = super_test;
    const the_text = JSON.parse(text);
    expect(statusCode).toBe(200);

    const health_check_ok = `"${HEALTH_CHECK_OK}"`;
    //    expect(the_text.body).toEqual(`"${HEALTH_CHECK_OK}"`);
    expect(the_text.body).toEqual(health_check_ok);
  });
});

// SNAP SHOT?????



afterAll(async () => {
  server.close();
});

