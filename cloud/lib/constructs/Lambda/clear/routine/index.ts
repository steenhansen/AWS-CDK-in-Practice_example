

// import { DynamoDB } from 'aws-sdk';
// //import { DynamoDB } from "@aws-sdk/client-dynamodb";

// import { httpResponse } from '../../handlers/httpResponse';


// import stack_config from '../../../../../cloud.config.json';

// const AWS_REGION = stack_config.AWS_REGION;

// const NO_SQL_WORK_ENDPOINT = stack_config.NO_SQL_WORK_ENDPOINT;
// const AWS_DYNAMO_ENDPOINT = stack_config.AWS_DYNAMO_ENDPOINT;
// import {
//   dynamoTableEnvLabel
// } from '../../../../../construct_labels';

// const THE_ENV = process.env.NODE_ENV || '';

// export const dynamo_clear_handler = async () => {
//   try {
//     let dynamoTableEnv_label;
//     let the_endpoint;
//     if (process.env["LOCAL_MODE"] === 'yes') {
//       dynamoTableEnv_label = dynamoTableEnvLabel('Local');
//       the_endpoint = NO_SQL_WORK_ENDPOINT;
//     } else {
//       dynamoTableEnv_label = dynamoTableEnvLabel(THE_ENV);
//       the_endpoint = AWS_DYNAMO_ENDPOINT;
//     }
//     const dynamo_DB = new DynamoDB.DocumentClient({
//       region: AWS_REGION,
//       endpoint: the_endpoint
//     });

//     const { Items }: DynamoDB.ScanOutput = await dynamo_DB
//       .scan({ TableName: dynamoTableEnv_label })
//       .promise();

//     if (Items) {
//       for (const item of Items) {
//         const the_id = item.id;
//         var fileItem = {
//           Key: {
//             id: the_id
//           },
//           TableName: dynamoTableEnv_label,
//         };
//         await dynamo_DB.delete(fileItem, function (err, data) {
//           if (err) console.log("dynamo-clear", err);
//           else console.log("dynamo-clear", data);
//         }).promise();
//       }
//     }



//     return httpResponse(200, JSON.stringify({ color_ints: Items }));
//   } catch (error: any) {
//     console.error(error);

//     return httpResponse(400, JSON.stringify({ message: error.message }));
//   }
// };
