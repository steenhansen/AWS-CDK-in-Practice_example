const label_post = "Url-Post";

import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CfnOutput, Duration, aws_logs as logs } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { Code, LayerVersion, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';


import stack_config from '../../../../program.constants.json';
import { nodeRuntime } from '../../../../utils/nodeVersion';

const C_cicd_NODE_RUNTIME = stack_config.C_cicd_NODE_RUNTIME;

////////////// ksdfj
import cdk_config from '../../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;


//////////////////////// ksdfj
interface IProps {
  vpc?: Vpc;
  dynamoTable: Table;
}


const the_runtime = nodeRuntime(C_cicd_NODE_RUNTIME);


export class DynamoPost extends Construct {
  public readonly func: NodejsFunction;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const { dynamoTable } = props;
    const layer_path = 'lib/constructs/Lambda/dynamo_layers';
    const the_layer = new LayerVersion(
      this, "PostDynamoLayer", {
      code: Code.fromAsset(layer_path),
      compatibleRuntimes: [the_runtime],
      layerVersionName: "NodeJsLayer"
    }
    );

    this.func = new NodejsFunction(scope, 'label_post', {
      runtime: the_runtime,
      entry: path.resolve(__dirname, 'routine', 'index.ts'),
      handler: 'dynamo_post_handler',
      timeout: Duration.seconds(30),
      environment: {
        NODE_ENV: WORK_ENV,
        TABLE_NAME: dynamoTable.tableName,
        REGION: AWS_REGION,
      },
      logRetention: logs.RetentionDays.TWO_WEEKS,
      layers: [the_layer],
      bundling: { externalModules: [] }
    });

    dynamoTable.grantReadWriteData(this.func);

    const dynamoPostLambdaUrl = this.func.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, label_post, {
      value: dynamoPostLambdaUrl.url,
    });

  }
}
