import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDBSeeder, Seeds } from '@cloudcomponents/cdk-dynamodb-seeder';



import {
  dynamoNameEnvLabel, dynamoTableEnvLabel, dynamoInlineSeederEnvLabel
} from '../../../construct_labels';
const THE_ENV = process.env.NODE_ENV || '';

const dynamoNameEnv_label = dynamoNameEnvLabel(THE_ENV);
const dynamoTableEnv_label = dynamoTableEnvLabel(THE_ENV);

const dynamoInlineSeederEnv_label = dynamoInlineSeederEnvLabel(THE_ENV);
export class DynamoDB extends Construct {
  readonly table: Table;


  constructor(scope: Construct, id: string) {
    super(scope, id);


    this.table = new Table(this, dynamoNameEnv_label, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: dynamoTableEnv_label,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: StreamViewType.NEW_IMAGE,
    });

    new DynamoDBSeeder(
      this,
      dynamoInlineSeederEnv_label,
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
