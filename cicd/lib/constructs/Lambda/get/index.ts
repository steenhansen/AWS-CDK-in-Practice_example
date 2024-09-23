const label_get = "Url-Get";

import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { CfnOutput, Duration, aws_logs as logs } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { Code, LayerVersion, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import the_constants from '../../../../program.constants.json';

const C_cicd_NODE_RUNTIME = the_constants.C_cicd_NODE_RUNTIME;

import cdk_config from '../../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

interface Str_to_Obj {
  [key: string]: { [key: string]: string; };
}

const THE_ENVIRONMENTS: Str_to_Obj = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;




interface IProps {
  vpc?: Vpc;
  dynamoTable: Table;
}



import { nodeRuntime } from '../../../../utils/nodeVersion';



const the_runtime = nodeRuntime(C_cicd_NODE_RUNTIME);


export class DynamoGet extends Construct {
  public readonly func: NodejsFunction;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);
    const { dynamoTable } = props;

    const layer_path = 'lib/constructs/Lambda/dynamo_layers';

    const the_layer = new LayerVersion(
      this, "GetDynamoLayer", {
      code: Code.fromAsset(layer_path),
      compatibleRuntimes: [the_runtime],
      layerVersionName: "NodeJsLayer"
    }
    );

    this.func = new NodejsFunction(scope, 'DynGet', {      // label_get
      runtime: the_runtime,
      entry: path.resolve(__dirname, 'routine', 'index.ts'),
      handler: 'dynamo_get_handler',
      timeout: Duration.seconds(30),
      environment: {
        NODE_ENV: WORK_ENV,
        TABLE_NAME: dynamoTable.tableName,
        REGION: AWS_REGION,
      },
      logRetention: logs.RetentionDays.TWO_WEEKS,
      layers: [the_layer],
      //      bundling: { externalModules: ['aws-sdk'] }
      bundling: { externalModules: [] }
      //  https://github.com/aws/aws-cdk/issues/26464
      //   nodeModules?
    });

    dynamoTable.grantReadData(this.func);


    const dynamoGetLambdaUrl = this.func.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, label_get, {
      value: dynamoGetLambdaUrl.url,
    });

  }
}
