import { Construct } from 'constructs';
import {
  EndpointType,
  LambdaIntegration,
  RestApi,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigateway';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { ACM } from '../ACM';
import { Route53 } from '../Route53';

import config from '../../../program.config.json';
const STACK_NAME = config.STACK_NAME;

import { HealthCheckLambda } from '../Lambda/healthcheck';
import { DynamoGet } from '../Lambda/get';
import { DynamoPost } from '../Lambda/post';
import { DynamoClear } from '../Lambda/clear';

interface Props {
  acm: ACM;
  route53: Route53;
  dynamoTable: Table;
}

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { acm, route53, dynamoTable } = props;

    const backEndSubDomain =
      process.env.NODE_ENV === 'Production'
        ? config.DOMAIN_SUB_BACKEND
        : config.DOMAIN_SUB_BACKEND_DEV;

    const restApi = new RestApi(this, 'chapter-9-rest-api', {
      restApiName: `${STACK_NAME}Apigw${process.env.NODE_ENV || ''}`,
      description: 'serverless api using lambda functions',
      domainName: {
        certificate: acm.certificate,
        domainName: `${backEndSubDomain}.${config.DOMAIN_NAME}`,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      deployOptions: {
        stageName: process.env.NODE_ENV === 'Production' ? 'prod' : 'dev',
      },
    });

    // Lambdas:
    const healthCheckLambda = new HealthCheckLambda(
      this,
      'health-check-lambda-api-endpoint',
      {},
    );

    const dynamoPost = new DynamoPost(this, 'dynamo-post-lambda', {
      dynamoTable,
    });

    const dynamoGet = new DynamoGet(this, 'dynamo-get-lambda', {
      dynamoTable,
    });
    const dynamoClear = new DynamoClear(this, 'dynamo-clear-lambda', {
      dynamoTable,
    });

    // Integrations:
    const healthCheckLambdaIntegration = new LambdaIntegration(
      healthCheckLambda.func,
    );

    const dynamoPostIntegration = new LambdaIntegration(dynamoPost.func);
    const dynamoClearIntegration = new LambdaIntegration(dynamoClear.func);

    const dynamoGetIntegration = new LambdaIntegration(dynamoGet.func);

    // Resources (Path)
    const healthcheck = restApi.root.addResource('healthcheck');
    const rootResource = restApi.root;

    // Methods
    healthcheck.addMethod('GET', healthCheckLambdaIntegration);
    healthcheck.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    });


    // Resources (Path)
    const slack_calls = restApi.root.addResource('slackCalls');

    slack_calls.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    });

    // Resources (Path)
    const clear_db = restApi.root.addResource('clearDB');
    clear_db.addMethod('GET', dynamoClearIntegration);
    clear_db.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    });
    rootResource.addMethod('POST', dynamoPostIntegration);
    rootResource.addMethod('GET', dynamoGetIntegration);
    rootResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    });

    // ARecord:
    new ARecord(this, 'BackendAliasRecord', {
      zone: route53.hosted_zone,
      target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      recordName: `${backEndSubDomain}.${config.DOMAIN_NAME}`,
    });
  }
}
