const label_dynamo = "Dynamo-Db";
const label_seeder = "Dynamo-Seeder";

import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDBSeeder, Seeds } from '@cloudcomponents/cdk-dynamodb-seeder';
import the_constants from '../../../program.constants.json';
const STATEFUL_ID = the_constants.STATEFUL_ID;
import config from '../../../program.config.json';
const STACK_NAME = config.STACK_NAME;
const DYNAMO_TABLE = config.DYNAMO_TABLE;
const THE_ENV = process.env.NODE_ENV || '';
import { statefulEnvLabel, lowerEnvLabel } from '../../../utils/construct_labels';

export class DynamoDB extends Construct {
  readonly table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    lowerEnvLabel;

    //const dynamo_name = `${STACK_NAME}.${STATEFUL_ID}.${label_dynamo}-${THE_ENV}`;
    const dynamo_name = statefulEnvLabel(label_dynamo);
    //  console.log("XXXXXXXXXXXXXXXXXXX 14397814", dynamo_name, dynamo_name2);

    //const seeder_name = `${STACK_NAME}.${STATEFUL_ID}.${label_seeder}-${THE_ENV}`;
    const seeder_name = statefulEnvLabel(label_seeder);
    //console.log("XXXXXXXXXXXXXXXXXXX 43534089", seeder_name, seeder_name2);

    // const tablename_upper = `${DYNAMO_TABLE}-${THE_ENV}`;
    // const tablename_lower = (tablename_upper).toLocaleLowerCase();
    const tablename_lower = lowerEnvLabel(DYNAMO_TABLE);
    //console.log("XXXXXXXXXXXXXXXXXXX 23424243", tablename_lower, tablename_lower2);




    this.table = new Table(this, dynamo_name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: tablename_lower,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: StreamViewType.NEW_IMAGE,
    });

    new DynamoDBSeeder(
      this,
      seeder_name,
      {
        table: this.table,
        seeds: Seeds.fromInline([
          {
            id: '12345678-9ABC-DEFG-HIJK-LMNOPRSTUVWX',
            the_color: 'blue',
            the_integer: 3
          },
        ]),
      },
    );



  }
}
