
import { Str_to_Str_or_Num } from '../../web/shapes';

const C_CONSTANT_START = "C_";
const WEB_MIDDLE = "_web_";

export function getConfigConstants(web_constants: Str_to_Str_or_Num, web_configs: Str_to_Str_or_Num, web_switches: Str_to_Str_or_Num): Str_to_Str_or_Num {
  let aws_to_web_constants: Str_to_Str_or_Num = {};

  for (let c_var in web_constants) {
    if (c_var.startsWith(C_CONSTANT_START) && c_var.includes(WEB_MIDDLE)) {
      const c_value = web_constants[c_var];
      aws_to_web_constants[c_var] = c_value;
    }
  }

  for (let a_var in web_configs) {
    if (a_var.startsWith(C_CONSTANT_START) && a_var.includes(WEB_MIDDLE)) {
      const a_value = web_configs[a_var];
      aws_to_web_constants[a_var] = a_value;
    }
  }

  for (let s_var in web_switches) {
    if (s_var.startsWith(C_CONSTANT_START) && s_var.includes(WEB_MIDDLE)) {
      const s_value = web_switches[s_var];
      aws_to_web_constants[s_var] = s_value;
    }
  }


  return aws_to_web_constants;
}

