import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { httpResponse } from '../../handlers/httpResponse';
import { Interfaces } from '../../../../../../web/program.interfaces';
import the_constants from '../../../../../program.constants.json';
import { dynamoClient, dynamoName, dynamoError, dynamoDelete, makeColorInt, makeScan } from '../../handlers/dynamo-client';
const REGEX_0_255 = the_constants.REGEX_0_255;
export interface PostEvent {
  body: string;
}
const regex_0_255 = new RegExp(REGEX_0_255);

export const dynamo_post_handler = async (event: PostEvent) => {
  try {
    const posted_object = JSON.parse(event.body);
    const { the_color, the_integer } = posted_object.color_int;
    if (the_color != 'red' && the_color != 'green' && the_color != 'blue') {
      return httpResponse(400, JSON.stringify({ message: "Color not red/green/blue" }));
    }
    if (!regex_0_255.test(the_integer)) {
      return httpResponse(400, JSON.stringify({ message: "Number not in 0..255" }));
    }
    const dynamo_table_name = dynamoName();
    try {
      const dynamo_DB = dynamoClient();
      const color_int: Interfaces.ColorInt = makeColorInt(the_color, the_integer);
      const get_color = makeScan(dynamo_table_name, the_color);
      const one_color_int: DynamoDB.ScanOutput = await dynamo_DB
        .scan(get_color)
        .promise();
      await dynamoDelete(dynamo_DB, one_color_int);
      await dynamo_DB.put({ TableName: dynamo_table_name, Item: color_int }).promise();
      return httpResponse(200, JSON.stringify({ color_int }));
    } catch (error: any) {
      const json_error = dynamoError(dynamo_table_name, error);
      return httpResponse(200, json_error);
    }
  } catch (error: any) {
    console.error(error);
    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
