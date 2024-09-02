import { DynamoDB } from 'aws-sdk';
//import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { httpResponse } from '../../handlers/httpResponse';



import stack_config from '../../../../../program.config.json';
const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;
import the_constants from '../../../../../program.constants.json';

const AWS_REGION = the_constants.AWS_REGION;

const NO_SQL_WORK_ENDPOINT = the_constants.NO_SQL_WORK_ENDPOINT;
const AWS_DYNAMO_ENDPOINT = the_constants.AWS_DYNAMO_ENDPOINT;
// import {
//   dynamoTableEnvLabel
// } from '../../../../../utils/construct_labels';
import { lowerEnvLabel, lowerLocalDbLabel } from '../../../../../utils/construct_labels';
const THE_ENV = process.env.NODE_ENV || '';
// const AWS_REGION = stack_config.AWS_REGION;
// const NO_SQL_WORK_ENDPOINT = stack_config.NO_SQL_WORK_ENDPOINT;
// const AWS_DYNAMO_ENDPOINT = stack_config.AWS_DYNAMO_ENDPOINT;
// import {
//   dynamoTableEnvLabel
// } from '../../../../../construct_labels';
// const THE_ENV = process.env.NODE_ENV || '';

//const is_local = process.env["SERVER_LOCAL_MODE"] === 'yes';

export const dynamo_get_handler = async () => {
  try {
    let dynamoTableEnv_label;
    //let dynamoTableEnv_label2;
    let the_endpoint;
    if (process.env["SERVER_LOCAL_MODE"] === 'yes') {
      //dynamoTableEnv_label = dynamoTableEnvLabel('Local');
      dynamoTableEnv_label = lowerLocalDbLabel();
      console.log("dddddddddddddddddd", dynamoTableEnv_label);
      the_endpoint = NO_SQL_WORK_ENDPOINT;
    } else {
      //dynamoTableEnv_label = dynamoTableEnvLabel(THE_ENV);
      dynamoTableEnv_label = lowerEnvLabel(DYNAMO_TABLE);
      the_endpoint = AWS_DYNAMO_ENDPOINT;
    }
    const dynamo_DB = new DynamoDB.DocumentClient({
      region: AWS_REGION,
      endpoint: the_endpoint
    });

    const { Items }: DynamoDB.ScanOutput = await dynamo_DB
      .scan({ TableName: dynamoTableEnv_label })
      .promise();
    return httpResponse(200, JSON.stringify({ color_ints: Items }));
  } catch (error: any) {
    console.error(error);
    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
