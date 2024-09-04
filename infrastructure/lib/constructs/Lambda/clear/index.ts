const label_clear = "Url-Clear";


import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CfnOutput, Duration, aws_logs as logs } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Table } from 'aws-cdk-lib/aws-dynamodb';


import { Code, LayerVersion, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';



interface IProps {
  vpc?: Vpc;
  dynamoTable: Table;
}

import stack_config from '../../../../program.constants.json';
const AWS_REGION = stack_config.AWS_REGION;
const NODE_RUNTIME = stack_config.NODE_RUNTIME;

import { nodeRuntime } from '../../../../utils/nodeVersion';


const the_runtime = nodeRuntime(NODE_RUNTIME);



export class DynamoClear extends Construct {
  public readonly func: NodejsFunction;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const { dynamoTable } = props;


    const layer_path = 'lib/constructs/Lambda/dynamo_layers';

    const the_layer = new LayerVersion(
      this, "ClearDynamoLayer", {
      code: Code.fromAsset(layer_path),
      compatibleRuntimes: [the_runtime],
      layerVersionName: "NodeJsLayer"
    }
    );

    this.func = new NodejsFunction(scope, 'DynClr', {
      runtime: the_runtime,
      entry: path.resolve(__dirname, 'routine', 'index.ts'),
      handler: 'dynamo_clear_handler',
      timeout: Duration.seconds(30),
      environment: {
        NODE_ENV: process.env.NODE_ENV as string,
        TABLE_NAME: dynamoTable.tableName,
        REGION: AWS_REGION as string,
      },
      logRetention: logs.RetentionDays.TWO_WEEKS,
      layers: [the_layer],
      bundling: { externalModules: ['aws-sdk'] }
    });

    dynamoTable.grantReadWriteData(this.func);



    const dynamoClearLambdaUrl = this.func.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, label_clear, {
      value: dynamoClearLambdaUrl.url,
    });

  }
}
