import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3 } from './constructs/S3';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';
import { ApiGateway } from './constructs/API-GW';
import { DynamoDB } from './constructs/DynamoDB';
import { AWSGlue } from './constructs/Glue';


const THE_ENV = process.env.NODE_ENV || '';

import {
  dynamoEnvLabel, route53EnvLabel, acmEnvLabel, glueEnvLabel,
  s3EnvLabel, apiGatewayEnvLabel
} from '../construct_labels';

const route53Env_label = route53EnvLabel(THE_ENV);
const acmEnv_label = acmEnvLabel(THE_ENV);
const s3Env_label = s3EnvLabel(THE_ENV);
const dynamoEnv_label = dynamoEnvLabel(THE_ENV);
const glueEnv_label = glueEnvLabel(THE_ENV);

const apiGatewayEnv_label = apiGatewayEnvLabel(THE_ENV);

export class TheMainStack extends Stack {
  public readonly acm: ACM;

  public readonly route53: Route53;

  public readonly s3: S3;



  public readonly dynamo: DynamoDB;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.dynamo = new DynamoDB(this, dynamoEnv_label);

    new AWSGlue(this, glueEnv_label, {
      table: this.dynamo.table,
    });

    this.route53 = new Route53(this, route53Env_label);

    this.acm = new ACM(this, acmEnv_label, {
      hosted_zone: this.route53.hosted_zone,
    });

    this.s3 = new S3(this, s3Env_label, {
      acm: this.acm,
      route53: this.route53,
    });


    new ApiGateway(this, apiGatewayEnv_label, {
      route53: this.route53,
      acm: this.acm,
      dynamoTable: this.dynamo.table,
    });
  }
}
