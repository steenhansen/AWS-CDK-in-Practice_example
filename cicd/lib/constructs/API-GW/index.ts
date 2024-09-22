
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;





const label_api_gw = "Pipe-Api-Gw";
const label_rest_api = "Pipe-Rest-Api";

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

const C_cicd_web_ENVIRON_PRODUCTION = config.C_cicd_web_ENVIRON_PRODUCTION;
const C_cicd_web_ENVIRON_DEVELOP = config.C_cicd_web_ENVIRON_DEVELOP;

import the_constants from '../../../program.constants.json';
const C_cicd_serv_HEALTH_CHECK_SLUG = the_constants.C_cicd_serv_HEALTH_CHECK_SLUG;
const C_cicd_serv_web_CLEARDB_SLUG = the_constants.C_cicd_serv_web_CLEARDB_SLUG;

import { HealthCheckLambda } from '../Lambda/healthcheck';
import { DynamoGet } from '../Lambda/get';
import { DynamoPost } from '../Lambda/post';
import { DynamoClear } from '../Lambda/clear';

interface Props {
  acm: ACM;
  route53: Route53;
  dynamoTable: Table;
}
import { printError } from '../../../utils/env-errors';

import { stackLabel, stackEnvLabel } from '../../../utils/construct_labels';

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { acm, route53, dynamoTable } = props;

    let backEndSubDomain;
    let stage_name;
    if (WORK_ENV === C_cicd_web_ENVIRON_PRODUCTION) {
      backEndSubDomain = config.C_cicd_web_DOMAIN_PROD_SUB_BACKEND;
      stage_name = 'Prod';
    } else if (WORK_ENV === C_cicd_web_ENVIRON_DEVELOP) {
      backEndSubDomain = config.C_cicd_web_DOMAIN_DEV_SUB_BACKEND;
      stage_name = 'Dev';
    } else {
      printError("WORK_ENV <> 'Env_prd' nor 'Env_dvl' ", 'cdk/lib/constructs/API-GW/', `NODE_ENV="${WORK_ENV}"`);
    }



    const apigw_name = stackLabel(label_rest_api);
    const rest_api = stackEnvLabel(label_api_gw);


    const restApi = new RestApi(this, apigw_name, {
      restApiName: rest_api,
      description: 'serverless api using lambda functions',
      domainName: {
        certificate: acm.certificate,
        domainName: `${backEndSubDomain}.${config.C_cicd_web_DOMAIN_NAME}`,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      deployOptions: {
        stageName: stage_name
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
    const healthcheck = restApi.root.addResource(C_cicd_serv_HEALTH_CHECK_SLUG);
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
    //    const clear_db = restApi.root.addResource('clearDB');
    const clear_db = restApi.root.addResource(C_cicd_serv_web_CLEARDB_SLUG);
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
      recordName: `${backEndSubDomain}.${config.C_cicd_web_DOMAIN_NAME}`,
    });
  }
}
