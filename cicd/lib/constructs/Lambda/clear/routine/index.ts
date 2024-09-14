import { DynamoDB } from 'aws-sdk';
import { httpResponse } from '../../handlers/httpResponse';
import { dynamoClient, dynamoName, dynamoError, dynamoDelete } from '../../handlers/dynamo-client';

export const dynamo_clear_handler = async () => {
  try {
    const dynamo_DB = dynamoClient();
    const dynamo_table_name = dynamoName();
    try {
      const all_color_ints: DynamoDB.ScanOutput = await dynamo_DB
        .scan({ TableName: dynamo_table_name })
        .promise();
      await dynamoDelete(dynamo_DB, all_color_ints);
      return httpResponse(200, JSON.stringify({ color_ints: [] }));
    } catch (error: any) {
      const json_error = dynamoError(dynamo_table_name, error);
      return httpResponse(200, json_error);
    }
  } catch (error: any) {
    console.error(error);
    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
