#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { Chapter9Stack } from '../lib/chapter-9-stack';
import { Chapter9PipelineStack } from '../lib/chapter-9-pipeline-stack';


import constants_config from '../program.constants.json';
const AWS_REGION = constants_config.AWS_REGION;

import stack_config from '../program.config.json';
const AWS_ACCOUNT_Cred = stack_config.AWS_ACCOUNT_Cred;

const app = new cdk.App();

if (['ONLY_DEV'].includes(process.env.CDK_MODE || '')) {
  try {
    new Chapter9Stack(app, `Chapter9Stack-${process.env.NODE_ENV || ''}`, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\x1b[41m", "\n**1** Is Docker Desktop turned on?\n\n", e, "\x1b[0m");
  }
}

if (['ONLY_PROD'].includes(process.env.CDK_MODE || '')) {
  try {
    new Chapter9Stack(app, `Chapter9Stack-${process.env.NODE_ENV || ''}`, {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\x1b[41m", "\n**2** Is Docker Desktop turned on?\n\n", e, "\x1b[0m");
  }
}

if (['ONLY_PIPELINE'].includes(process.env.CDK_MODE || '')) {
  try {
    console.log("DDDDDDDDDDDDDDDDDDDDDDD");
    new Chapter9PipelineStack(app, 'Chapter9PipelineStack', {
      env: { region: AWS_REGION, account: AWS_ACCOUNT_Cred },
    });
  } catch (e) {
    console.log("\x1b[41m", "\n**3** Is Docker Desktop turned on?\n\n", e, "\x1b[0m");
  }
}
