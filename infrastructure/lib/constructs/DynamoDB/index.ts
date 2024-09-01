const logical_dynamo = "Dynamo-DB";
const logical_seeder = "Dynamo-Seeder";

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

export class DynamoDB extends Construct {
  readonly table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const dynamo_name = `${STACK_NAME}.${STATEFUL_ID}.${logical_dynamo}-${THE_ENV}`;
    const seeder_name = `${STACK_NAME}.${STATEFUL_ID}.${logical_seeder}-${THE_ENV}`;

    const tablename_upper = `${DYNAMO_TABLE}-${THE_ENV}`;
    const tablename_lower = (tablename_upper).toLocaleLowerCase();


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
