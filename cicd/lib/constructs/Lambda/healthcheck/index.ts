const label_health = "Url-Health";

import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration, aws_logs as logs } from 'aws-cdk-lib';

import stack_config from '../../../../program.constants.json';
const NODE_RUNTIME = stack_config.NODE_RUNTIME;

import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { nodeRuntime } from '../../../../utils/nodeVersion';
const the_runtime: Runtime = nodeRuntime(NODE_RUNTIME);

export class HealthCheckLambda extends Construct {
  public readonly func: NodejsFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.func = new NodejsFunction(scope, 'health-check-lambda', {   //label_health
      runtime: the_runtime,
      entry: path.resolve(__dirname, 'routine', 'index.ts'),
      handler: 'healthcheck_handler',
      timeout: Duration.seconds(30),
      environment: {},
      logRetention: logs.RetentionDays.TWO_WEEKS,
    });
  }
}
