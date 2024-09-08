import { DynamoDB } from 'aws-sdk';
import { httpResponse } from '../../handlers/httpResponse';
import stack_config from '../../../../../program.config.json';
const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;
import { lowerEnvLabel, lowerLocalDbLabel } from '../../../../../utils/construct_labels';
import the_constants from '../../../../../program.constants.json';
const AWS_REGION = the_constants.AWS_REGION;
const NO_SQL_WORK_ENDPOINT = the_constants.NO_SQL_WORK_ENDPOINT;
const AWS_DYNAMO_ENDPOINT = the_constants.AWS_DYNAMO_ENDPOINT;

export const dynamo_clear_handler = async () => {
  try {
    let dynamoTableEnv_label;
    let the_endpoint;
    if (process.env["SERVER_LOCAL_MODE"] === 'yes') {
      dynamoTableEnv_label = lowerLocalDbLabel();
      the_endpoint = NO_SQL_WORK_ENDPOINT;
    } else {
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

    if (Items) {
      for (const item of Items) {
        const the_id = item.id;
        var fileItem = {
          Key: {
            id: the_id
          },
          TableName: dynamoTableEnv_label,
        };
        await dynamo_DB.delete(fileItem, function (err, data) {
          if (err) console.log("dynamo-clear", err);
          else console.log("dynamo-clear", data);
        }).promise();
      }
    }
    return httpResponse(200, JSON.stringify({ color_ints: Items }));
  } catch (error: any) {
    console.error(error);
    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
