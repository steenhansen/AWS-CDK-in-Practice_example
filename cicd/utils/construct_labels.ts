





////////////// ksdfj
import cdk_config from '../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
//////////////////////// ksdfj


import stack_config from '../program.config.json';
const STACK_NAME = stack_config.STACK_NAME;
const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;
const ENVIRON_PRODUCTION = stack_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = stack_config.ENVIRON_DEVELOP;

import the_constants from '../program.constants.json';
const STATEFUL_ID = the_constants.STATEFUL_ID;




import { printError } from './env-errors';

let prod_or_dev: string;
if (WORK_ENV === ENVIRON_PRODUCTION) {
  prod_or_dev = 'Prod';
} else if (WORK_ENV === ENVIRON_DEVELOP) {
  prod_or_dev = 'Dev';
} else {
  printError("WORK_ENV <> 'Env_prd' nor 'Env_dvl' ", 'cdk/utils/construct_labels.ts', `NODE_ENV="${WORK_ENV}"`);
}

export function statefulEnvLabel(the_name: string) {
  const stateful_label = `${STACK_NAME}-${STATEFUL_ID}-${the_name}-${prod_or_dev}`;
  return stateful_label;
}

export function lowerStatefulEnvLabel(the_name: string) {
  const stateful_label = statefulEnvLabel(the_name);
  const lower_label = (stateful_label).toLocaleLowerCase();
  return lower_label;
}

export function stackEnvLabel(the_name: string) {
  const stateful_label = `${STACK_NAME}-${the_name}-${prod_or_dev}`;
  return stateful_label;
}



export function stackLabel(the_name: string) {
  const stateful_label = `${STACK_NAME}-${the_name}`;
  return stateful_label;
}


export function envLabel(the_name: string) {
  const env_label = `${the_name}-${prod_or_dev}`;
  return env_label;
}

export function lowerEnvLabel(the_name: string) {
  const env_label = envLabel(the_name);
  const lower_label = (env_label).toLocaleLowerCase();
  return lower_label;
}


export function lowerLocalAwsDbLabel(local_or_aws: string) {
  const upper_table = `${DYNAMO_TABLE}.${local_or_aws}.${WORK_ENV}`;
  const lower_label = (upper_table).toLocaleLowerCase();
  return lower_label;
}