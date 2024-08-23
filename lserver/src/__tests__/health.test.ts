import supertest from 'supertest';
//import create_app from '../createApp';
import { describe, expect, test, it, afterAll } from '@jest/globals';
import createApp from '../index';

// import config from '../server.config.json';
// const PORT_TEST = config.PORT_TEST;


const app = createApp();
// const server = app.listen(PORT_TEST, () => {
//   console.info(`Test server is listening on port ${PORT_TEST}`);
// });
// server.keepAliveTimeout = 10;
// server.headersTimeout = 10;
// create_app();

describe('health check route', () => {
  it('Should return status 200 and text: "Health-OK"', async () => {
    const super_test = await supertest(app).get('/health');
    const { body, statusCode, text } = super_test;
    const the_text = JSON.parse(text);
    expect(statusCode).toBe(200);
    expect(the_text.body).toEqual('"Health-OK"');
  });
});


// afterAll(async () => {
//   server.close();
// });