import { DynamoDB } from 'aws-sdk';
//import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { v4 as uuidv4 } from 'uuid';

import { Interfaces } from '../../../../../../lbrowser/program.interfaces';


import { httpResponse } from '../../handlers/httpResponse';


import stack_config from '../../../../../cloud.config.json';
const AWS_REGION = stack_config.AWS_REGION;

const NO_SQL_WORK_ENDPOINT = stack_config.NO_SQL_WORK_ENDPOINT;
const AWS_DYNAMO_ENDPOINT = stack_config.AWS_DYNAMO_ENDPOINT;

import {
  dynamoTableEnvLabel
} from '../../../../../construct_labels';

const THE_ENV = process.env.NODE_ENV || '';

export interface PostEvent {
  body: string;
}


export const dynamo_post_handler = async (event: PostEvent) => {
  try {
    const posted_object = JSON.parse(event.body);
    const { the_color, the_integer } = posted_object.color_int;

    let dynamoTableEnv_label;
    let the_endpoint;
    if (process.env["LOCAL_MODE"] === 'yes') {
      dynamoTableEnv_label = dynamoTableEnvLabel('Local');
      the_endpoint = NO_SQL_WORK_ENDPOINT;
    } else {
      dynamoTableEnv_label = dynamoTableEnvLabel(THE_ENV);
      the_endpoint = AWS_DYNAMO_ENDPOINT;
    }

    const dynamoDB = new DynamoDB.DocumentClient({
      region: AWS_REGION,
      endpoint: the_endpoint
    });

    if (the_color != 'red' && the_color != 'green' && the_color != 'blue') {
      return httpResponse(400, JSON.stringify({ message: "Color not red/green/blue" }));
    }
    const checked_int = +the_integer;
    if (!isNaN(checked_int) && 0 < checked_int && checked_int < 4) {
      const color_int: Interfaces.ColorInt = {
        id: uuidv4(),
        the_color,
        the_integer: checked_int
      };

      var get_colors = {
        TableName: dynamoTableEnv_label,
        ExpressionAttributeNames: {
          '#the_color': "the_color",
        },
        ExpressionAttributeValues: {
          ":the_color": the_color,
        },
        FilterExpression: "#the_color = :the_color"
      };

      const { Items }: DynamoDB.ScanOutput = await dynamoDB
        .scan(get_colors)
        .promise();

      if (Items) {
        for (const item of Items) {
          console.log("item", item);
          const the_id = item.id;
          var fileItem = {
            Key: {
              id: the_id
            },
            TableName: dynamoTableEnv_label,
          };
          await dynamoDB.delete(fileItem, function (err, data) {
            if (err) console.log("dynamo-post", err);
            else console.log("dynamo-post", data);
          }).promise();
        }
      }





      await dynamoDB.put({ TableName: dynamoTableEnv_label, Item: color_int }).promise();
      return httpResponse(200, JSON.stringify({ color_int }));
    } else {
      return httpResponse(400, JSON.stringify({ message: "Number not in 1..3" }));
    }

  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
