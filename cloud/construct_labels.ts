import console = require('console');




import { Stack } from 'aws-cdk-lib';

import stack_config from './cloud.config.json';
const STACK_NAME = stack_config.STACK_NAME;
const S3_UNIQUE_ID = stack_config.S3_UNIQUE_ID;

const DOMAIN_NAME = stack_config.DOMAIN_NAME;

const DOMAIN_SUB_FRONTEND = stack_config.DOMAIN_SUB_FRONTEND;
const DOMAIN_SUB_FRONTEND_DEV = stack_config.DOMAIN_SUB_FRONTEND_DEV;

const DOMAIN_SUB_BACKEND = stack_config.DOMAIN_SUB_BACKEND;
const DOMAIN_SUB_BACKEND_DEV = stack_config.DOMAIN_SUB_BACKEND_DEV;


const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;

export function dynamoEnvLabel(the_env: string) {
  const dynamoEnv_label = `Dynamo-${the_env}`;

  return dynamoEnv_label;
}



////////////////////////////




export function dynUrlPostLabel() {
  const dynUrlPost_label = `DynUrlPost`;
  return dynUrlPost_label;
}

export function dynUrlGetLabel() {
  const dynUrlGet_label = `DynUrlGet`;
  return dynUrlGet_label;
}


export function dynUrlClearLabel() {
  const dynUrlClear_label = `DynUrlClear`;
  return dynUrlClear_label;
}






export function namedRestApiLabel() {
  const namedRestApi_label = `${STACK_NAME}-rest-api`;
  return namedRestApi_label;
}

export function namedRestApiEnvLabel(the_env: string) {
  const namedRestApiEnv_label = `${STACK_NAME}-rest-api-${the_env}`;
  return namedRestApiEnv_label;
}










export function apiGatewayEnvLabel(the_env: string) {
  const apiGatewayEnv_label = `Api-${the_env}`;
  return apiGatewayEnv_label;
}



export function glueEnvLabel(the_env: string) {
  const glueEnv_label = `Glue-${the_env}`;
  return glueEnv_label;
}





export function namedStackEnvLabel(the_env: string) {
  const namedStackEnv_label = `${STACK_NAME}${the_env}`;
  return namedStackEnv_label;
}

export function namedPipelineStackLabel() {
  const namedPipelineStack_label = `${STACK_NAME}PipelineStack`;
  return namedPipelineStack_label;
}


export function namedDevPipelineLabel() {
  const namedDevPipeline_label = `${STACK_NAME}-dev-pipeline`;
  return namedDevPipeline_label;
}


export function namedProdPipelineLabel() {
  const namedProdPipeline_label = `${STACK_NAME}-prod-pipeline`;
  return namedProdPipeline_label;
}


export function namedPipelineEnvLabel(the_env: string) {
  const namedPipelineEnv_label = `${STACK_NAME}-Pipeline-${the_env}`;
  return namedPipelineEnv_label;
}







export function namedPipelineLabel() {
  const namedPipeline_label = `${STACK_NAME}-Pipeline`;
  return namedPipeline_label;
}




export function dynamoNameEnvLabel(the_env: string) {
  const dynamoNameEnv_label = `Dynamo-Table-${the_env}`;
  return dynamoNameEnv_label;
}




export function dynamoTableEnvLabel(the_env: string) {
  const lower_env = the_env.toLowerCase();
  const dynamoTableEnv_label = `${DYNAMO_TABLE}-${lower_env}`;
  return dynamoTableEnv_label;
}


export function s3EnvLabel(the_env: string) {
  const s3Env_label = `S3-${the_env}`;
  return s3Env_label;
}



export function dynamoInlineSeederEnvLabel(the_env: string) {
  const dynamoInlineSeederEnv_label = `Dynamo-InlineSeeder-${the_env}`;
  return dynamoInlineSeederEnv_label;
}





export function frontendDistributionEnvLabel(the_env: string) {
  const frontendDistributionEnv_label = `Frontend-Distribution-${the_env}`;
  return frontendDistributionEnv_label;
}


export function frontEndAliasRecordEnvLabel(the_env: string) {
  const frontEndAliasRecordEnv_label = `FrontendAliasRecord-${the_env}`;
  return frontEndAliasRecordEnv_label;
}

export function frontEndUrlEnvLabel(the_env: string) {
  const frontEndUrlEnv_label = `FrontendURL-${the_env}`;
  return frontEndUrlEnv_label;
}






export function namedWebBucketEnvLabel(the_env: string) {
  const lower_stack_name = STACK_NAME.toLocaleLowerCase();
  const lower_env = the_env.toLocaleLowerCase();
  const namedWebBucketEnv_label = `${lower_stack_name}bucket-${S3_UNIQUE_ID}-${lower_env}`;
  return namedWebBucketEnv_label;
}



export function webBucketEnvLabel(the_env: string) {
  const webBucketEnv_label = `WebBucket-${the_env}`;
  return webBucketEnv_label;
}

export function webBucketDeploymentEnvLabel(the_env: string) {
  const webBucketDeploymentEnv_label = `WebBucketDeployment-${the_env}`;
  return webBucketDeploymentEnv_label;
}




export function route53EnvLabel(the_env: string) {
  const route53Env_label = `Route53-${the_env}`;
  return route53Env_label;
}

export function acmEnvLabel(the_env: string) {
  const acmEnv_label = `ACM-${the_env}`;
  return acmEnv_label;
}



export function frontEndDomainName(the_env: string) {
  if (the_env === 'Prod') {
    var frontEnd_domainName = `${DOMAIN_SUB_FRONTEND}.${DOMAIN_NAME}`;
  } else {
    var frontEnd_domainName = `${DOMAIN_SUB_FRONTEND_DEV}.${DOMAIN_NAME}`;
  }
  return frontEnd_domainName;
}

export function backEndSubDomainName(the_env: string) {
  if (the_env === 'Prod') {
    var backEnd_domainName = `${DOMAIN_SUB_BACKEND}.${DOMAIN_NAME}`;
  } else {
    var backEnd_domainName = `${DOMAIN_SUB_BACKEND_DEV}.${DOMAIN_NAME}`;
  }
  return backEnd_domainName;
}

