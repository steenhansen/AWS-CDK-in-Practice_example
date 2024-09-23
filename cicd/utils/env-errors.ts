import cdk_config from '../cdk.json';

const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
interface Str_to_Obj {
  [key: string]: { [key: string]: string; };
}

const THE_ENVIRONMENTS: Str_to_Obj = cdk_config.context.environment_consts;

interface Str_to_Str_or_Num {
  [key: string]: string | number;
}

const BACKGROUND_COLORS: Str_to_Str_or_Num = {
  "Red": "[41m",
  "Green": "[42m",
  "Magenta": "[45m",
  "Cyan": "[46m"
};

const TEXT_COLORS: Str_to_Str_or_Num = {
  "Red": "[31m",
  "Green": "[32m",
  "Magenta": "[35m",
  "Cyan": "[36m"
};

const hex_escape = '\x1b';
const stop_escape = '\x1b[0m';

const red_background: string = hex_escape + BACKGROUND_COLORS['Red'];

const green_background: string = hex_escape + BACKGROUND_COLORS['Green'];

const red_text: string = hex_escape + TEXT_COLORS['Red'];

export function printError(error_mess: string, error_loc: string, err_or_val: string) {
  const line_1 = `${red_background} **** %s ${stop_escape}`;
  const line_2 = `${green_background}  %s ${stop_escape}`;
  const line_3 = `${red_text}  %s ${stop_escape}`;
  const error_s_s_s = line_1 + line_2 + line_3;
  console.log(error_s_s_s, error_mess, error_loc, err_or_val);
}

export function printConfig(work_env: string, stack_name: string) {
  const color_name: string = THE_ENVIRONMENTS[WORK_ENV].COLOR_BACKGROUND;
  const ansi_color = hex_escape + BACKGROUND_COLORS[color_name];
  const line_1 = `${ansi_color} %s - %s ${stop_escape}`;
  console.log(line_1, work_env, stack_name);
}