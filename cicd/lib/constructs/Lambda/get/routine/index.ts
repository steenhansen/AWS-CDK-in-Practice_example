import { DynamoDB } from 'aws-sdk';
//import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { httpResponse } from '../../handlers/httpResponse';
import { dynamoClient, dynamoName, dynamoError } from '../../handlers/dynamo-client';

export const dynamo_get_handler = async () => {
  try {
    const dynamo_DB = dynamoClient();
    const dynamo_table_name = dynamoName();
    try {
      const all_color_ints: DynamoDB.ScanOutput = await dynamo_DB
        .scan({ TableName: dynamo_table_name })
        .promise();
      // console.log("in cdk all_color_ints=", all_color_ints);
      return httpResponse(200, JSON.stringify({ color_ints: all_color_ints.Items }));
    } catch (error: any) {
      const json_error = dynamoError(dynamo_table_name, error);
      return httpResponse(200, json_error);
    }
  } catch (error: any) {
    console.error(error);
    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
