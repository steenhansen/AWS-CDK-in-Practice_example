/* ---------- External Libraries ---------- */
import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Duration, aws_logs as logs } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

interface IProps {
  vpc?: Vpc;
  dynamoTable: Table;
}

export class SendEmail extends Construct {
  public readonly func: NodejsFunction;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const { dynamoTable } = props;

    const node_expected = 'nodejs' + 20 + ".x";
    const node_runtime = new Runtime(node_expected, 0, { supportsInlineCode: true });


    this.func = new NodejsFunction(scope, 'dynamo-post', {
      runtime: node_runtime,
      entry: path.resolve(__dirname, 'lambda', 'index.ts'),
      handler: 'handler',
      timeout: Duration.seconds(30),
      environment: {
        NODE_ENV: process.env.NODE_ENV as string,
        TABLE_NAME: dynamoTable.tableName,
        REGION: process.env.CDK_DEFAULT_REGION as string,
        EMAIL_ADDRESS: "steen_hansen@yahoo.com",
      },
      logRetention: logs.RetentionDays.TWO_WEEKS,
    });

    dynamoTable.grantWriteData(this.func);

    dynamoTable.grantStreamRead(this.func);

    this.func.addEventSourceMapping('MyEventSourceMapping', {
      eventSourceArn: dynamoTable.tableStreamArn,
      startingPosition: StartingPosition.TRIM_HORIZON,
    });
  }
}
