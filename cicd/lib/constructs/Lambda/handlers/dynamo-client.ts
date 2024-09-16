import { DynamoDB } from 'aws-sdk';
//import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { lowerLocalAwsDbLabel } from '../../../../utils/construct_labels';
import { printError } from '../../../../utils/env-errors';
import { Interfaces } from '../../../../../web/program.interfaces';
import { v4 as uuidv4 } from 'uuid';

import the_constants from '../../../../program.constants.json';
const FETCH_TIMEOUT = the_constants.FETCH_TIMEOUT;
const FETCH_RETRIES = the_constants.FETCH_RETRIES;
const NO_SQL_WORK_ENDPOINT = the_constants.NO_SQL_WORK_ENDPOINT;
const AWS_DYNAMO_ENDPOINT = the_constants.AWS_DYNAMO_ENDPOINT;
const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;
const TABLE_NOT_EXIST = the_constants.TABLE_NOT_EXIST;
const LOCATION_AWS = the_constants.LOCATION_AWS;
const LOCATION_LOCAL = the_constants.LOCATION_LOCAL;

import cdk_config from '../../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;

export const dynamoName = () => {
  let dynamo_table_name;
  if (process.env["SERVER_LOCAL_MODE"] === 'yes') {
    dynamo_table_name = lowerLocalAwsDbLabel(LOCATION_LOCAL);
  } else {
    dynamo_table_name = lowerLocalAwsDbLabel(LOCATION_AWS);
  }
  return dynamo_table_name;
};

export const dynamoClient = () => {
  let the_endpoint;
  if (process.env["SERVER_LOCAL_MODE"] === 'yes') {
    the_endpoint = NO_SQL_WORK_ENDPOINT;
  } else {
    the_endpoint = AWS_DYNAMO_ENDPOINT;
  }
  const dynamo_DB = new DynamoDB.DocumentClient({
    region: AWS_REGION,
    endpoint: the_endpoint,
    maxRetries: FETCH_RETRIES,
    httpOptions: {
      timeout: FETCH_TIMEOUT,
    },
  });
  return dynamo_DB;
};

export const dynamoError = (dynamo_table_name: string, error: any) => {
  if (error.code === "ResourceNotFoundException") {
    const error_mess = TABLE_NOT_EXIST + ' ' + dynamo_table_name;
    printError(error.code, 'cdk/lib/constructs/Lambda/get/clear/post', error_mess);
  } else {
    const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
    printError(error.code, 'cdk/lib/constructs/Lambda/get/clear/post', error_mess);
  }
  const error_str = JSON.stringify({ color_ints: error.code });
  return error_str;
};

export const dynamoDelete = async (dynamo_DB: DynamoDB.DocumentClient,
  all_color_ints: DynamoDB.ScanOutput) => {
  const dynamo_table_name = dynamoName();
  if (all_color_ints.Items) {
    for (const item of all_color_ints.Items) {
      const the_id = item.id;
      var fileItem = {
        Key: {
          id: the_id
        },
        TableName: dynamo_table_name,
      };
      await dynamo_DB.delete(fileItem, function (err, data) {
        if (err) {
          console.log("dynamo-clear", err);
        }
      }).promise();
    }
  }
};

export const makeColorInt = (the_color: string, the_integer: string) => {
  const checked_int = +the_integer;
  const new_color_int: Interfaces.ColorInt = {
    id: uuidv4(),
    the_color,
    the_integer: checked_int
  };
  return new_color_int;
};

export const makeScan = (dynamo_table_name: string, the_color: string) => {
  const get_colors = {
    TableName: dynamo_table_name,
    ExpressionAttributeNames: {
      '#the_color': "the_color",
    },
    ExpressionAttributeValues: {
      ":the_color": the_color,
    },
    FilterExpression: "#the_color = :the_color"
  };
  return get_colors;
};