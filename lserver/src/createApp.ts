import express from 'express';
import cors from 'cors';

//  idea is to have createApp have aws-sdk installed
// so that the post will be ok on compile

//import { DynamoDB } from 'aws-sdk';  // qbert
//import { v4 as uuidv4 } from 'uuid'; // qbert to that health.test.ts fill not crash

import { dynamo_post_handler } from '../../cloud/lib/constructs/Lambda/post/routine/';
import { dynamo_get_handler } from '../../cloud/lib/constructs/Lambda/get/routine/';
import { dynamo_clear_handler } from '../../cloud/lib/constructs/Lambda/clear/routine/';

import { healthcheck_handler } from '../../cloud/lib/constructs/Lambda/healthcheck/routine/';



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


function checkNoSqlWork(response_json: any) {
  if (response_json.hasOwnProperty('message')) {
    const err_mess = response_json.message;
    if (err_mess.startsWith("Inaccessible host:")) {
      console.log("**** Is 'DDB local' turned on in NoSQL Workbench?");
      console.log("**** Is there a VPN running?");
    }
  }
}

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', async (_req, res) => {
    try {
      const response = await healthcheck_handler();
      const response_json = JSON.stringify(response);
      return res.status(200).send(response_json);
    } catch (e: unknown) {
      return corsResponse("the_e");
    }
  });


  // app.get('/clear', async (_req, res) => {   qbert
  //   try {
  //     const response = await dynamo_clear_handler();
  //     const response_json = JSON.stringify(response);
  //     checkNoSqlWork(response_json);
  //     return res.status(200).send(response_json);
  //   } catch (e: unknown) {
  //     return corsResponse("the_e");
  //   }
  // });

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
