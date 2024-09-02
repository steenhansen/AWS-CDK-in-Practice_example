import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
//import { dynamoTableEnvLabel } from '../../../../../utils/construct_labels';
import { httpResponse } from '../../handlers/httpResponse';
import { Interfaces } from '../../../../../../web/program.interfaces';

import stack_config from '../../../../../program.config.json';
const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;

import the_constants from '../../../../../program.constants.json';
const AWS_REGION = the_constants.AWS_REGION;
const REGEX_0_255 = the_constants.REGEX_0_255;
const NO_SQL_WORK_ENDPOINT = the_constants.NO_SQL_WORK_ENDPOINT;
const AWS_DYNAMO_ENDPOINT = the_constants.AWS_DYNAMO_ENDPOINT;
const THE_ENV = process.env.NODE_ENV || '';
import { lowerEnvLabel, lowerLocalDbLabel } from '../../../../../utils/construct_labels';
export interface PostEvent {
  body: string;
}

export const dynamo_post_handler = async (event: PostEvent) => {
  try {
    const posted_object = JSON.parse(event.body);
    const { the_color, the_integer } = posted_object.color_int;

    let dynamoTableEnv_label;
    // let dynamoTableEnv_label2;
    let the_endpoint;
    if (process.env["SERVER_LOCAL_MODE"] === 'yes') {
      //dynamoTableEnv_label = dynamoTableEnvLabel('Local');
      dynamoTableEnv_label = lowerLocalDbLabel();
      the_endpoint = NO_SQL_WORK_ENDPOINT;
    } else {
      // dynamoTableEnv_label = dynamoTableEnvLabel(THE_ENV);
      dynamoTableEnv_label = lowerEnvLabel(DYNAMO_TABLE);
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


    const regex_0_255 = new RegExp(REGEX_0_255);


    if (regex_0_255.test(the_integer)) {
      //if (!isNaN(checked_int) && 0 < checked_int && checked_int < 4) {
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
      return httpResponse(400, JSON.stringify({ message: "Number not in 0..255" }));
    }

  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
