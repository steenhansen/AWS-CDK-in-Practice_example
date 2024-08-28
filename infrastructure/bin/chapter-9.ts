#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { config } from 'dotenv';

import { Chapter9Stack } from '../lib/chapter-9-stack';
import { Chapter9PipelineStack } from '../lib/chapter-9-pipeline-stack';

config({ path: process.env.DOTENV_CONFIG_PATH });

import stack_config from '../infrastructure.config.json';
const AWS_REGION = stack_config.AWS_REGION;
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;

const app = new cdk.App();

if (['ONLY_DEV'].includes(process.env.CDK_MODE || '')) {
  try {
    new Chapter9Stack(app, `Chapter9Stack-${process.env.NODE_ENV || ''}`, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**1** Is Docker Desktop turned on?\n\n", e);
  }
}

if (['ONLY_PROD'].includes(process.env.CDK_MODE || '')) {
  try {
    new Chapter9Stack(app, `Chapter9Stack-${process.env.NODE_ENV || ''}`, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**2** Is Docker Desktop turned on?\n\n", e);
  }
}

if (['ONLY_PIPELINE'].includes(process.env.CDK_MODE || '')) {
  try {
    new Chapter9PipelineStack(app, 'Chapter9PipelineStack', {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\n**3** Is Docker Desktop turned on?\n\n", e);
  }
}
