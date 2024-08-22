#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { TheMainStack } from '../lib/the_main_stack';
import { ThePipelineStack } from '../lib/the-pipeline-stack';

import stack_config from '../cloud.config.json';
const AWS_REGION = stack_config.AWS_REGION;
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;

import { namedStackEnvLabel, namedPipelineStackLabel } from '../construct_labels';
const THE_ENV = process.env.NODE_ENV || '';
const THE_MODE = process.env.CDK_ENV || '';
const stack_label = namedStackEnvLabel(THE_ENV);
const namedPipelineStack_label = namedPipelineStackLabel();


const app = new cdk.App();

if (['ERECT_DEV'].includes(THE_MODE)) {
  try {
    new TheMainStack(app, stack_label, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**** Is Docker Desktop turned on?\n\n", e);
  }
}

if (['ERECT_PROD'].includes(THE_MODE)) {
  try {
    new TheMainStack(app, stack_label, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**** Is Docker Desktop turned on?\n\n", e);
  }
}

if (['ERECT_PIPELINE'].includes(THE_MODE)) {
  try {
    new ThePipelineStack(app, namedPipelineStack_label, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**** Is Docker Desktop turned on?\n\n", e);
  }
}
