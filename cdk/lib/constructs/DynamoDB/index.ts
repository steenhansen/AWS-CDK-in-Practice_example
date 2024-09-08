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

    const dynamo_name = statefulEnvLabel(label_dynamo);

    const seeder_name = statefulEnvLabel(label_seeder);

    const tablename_lower = lowerEnvLabel(DYNAMO_TABLE);



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
