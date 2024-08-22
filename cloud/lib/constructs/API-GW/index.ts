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
import { HealthCheckLambda } from '../Lambda/healthcheck';
import { DynamoGet } from '../Lambda/get';
import { DynamoPost } from '../Lambda/post';
import { DynamoClear } from '../Lambda/clear';



const THE_ENV = process.env.NODE_ENV || '';

import {
  backEndSubDomainName, namedRestApiLabel, namedRestApiEnvLabel
} from '../../../construct_labels';
const backEnd_domainName = backEndSubDomainName(THE_ENV);

const namedRestApi_label = namedRestApiLabel();
const namedRestApiEnv_label = namedRestApiEnvLabel(THE_ENV);

interface Props {
  acm: ACM;
  route53: Route53;
  dynamoTable: Table;
}


export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { acm, route53, dynamoTable } = props;

    const restApi = new RestApi(this, namedRestApi_label, {
      restApiName: namedRestApiEnv_label,
      description: 'serverless api using lambda functions',
      domainName: {
        certificate: acm.certificate,
        domainName: backEnd_domainName,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      deployOptions: {
        stageName: process.env.NODE_ENV === 'Prod' ? 'prod' : 'dev',
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


    const rootResource = restApi.root;

    // Resources (Path)
    const healthcheck = restApi.root.addResource('healthcheck');
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
      recordName: backEnd_domainName,
    });
  }
}
