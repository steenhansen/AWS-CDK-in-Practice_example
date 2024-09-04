import stack_config from '../program.config.json';

const LOCAL_DB_ENV = stack_config.LOCAL_DB_ENV;

const STACK_NAME = stack_config.STACK_NAME;
const DYNAMO_TABLE = stack_config.DYNAMO_TABLE;


import the_constants from '../program.constants.json';
const STATEFUL_ID = the_constants.STATEFUL_ID;

const THE_ENV = process.env.NODE_ENV || '';
const prod_or_dev = THE_ENV === 'Env_prd' ? 'Prod' : 'Dev';

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

export function lowerLocalDbLabel() {
  const upper_table = `${DYNAMO_TABLE}.${LOCAL_DB_ENV}`;
  const lower_label = (upper_table).toLocaleLowerCase();
  return lower_label;
}

