import the_constants from '../program.constants.json';
const BACKGROUND_COLORS: Partial<Record<string, string>> = the_constants.BACKGROUND_COLORS;
const TEXT_COLORS: Partial<Record<string, string>> = the_constants.TEXT_COLORS;

import cdk_config from '../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;

const hex_escape = '\x1b';
const stop_escape = '\x1b[0m';

const red_background = hex_escape + BACKGROUND_COLORS['Red'];

const green_background = hex_escape + BACKGROUND_COLORS['Green'];

const red_text = hex_escape + TEXT_COLORS['Red'];

export function printError(error_mess: string, error_loc: string, err_or_val: string) {
  const line_1 = `${red_background} **** %s ${stop_escape}`;
  const line_2 = `${green_background}  %s ${stop_escape}`;
  const line_3 = `${red_text}  %s ${stop_escape}`;
  const error_s_s_s = line_1 + line_2 + line_3;
  console.log(error_s_s_s, error_mess, error_loc, err_or_val);
}

export function printConfig(work_env: string, stack_name: string) {
  const color_name = THE_ENVIRONMENTS[WORK_ENV].COLOR_BACKGROUND;
  const ansi_color = hex_escape + BACKGROUND_COLORS[color_name];

  const line_1 = `${ansi_color} %s - %s ${stop_escape}`;
  console.log(line_1, work_env, stack_name);
}