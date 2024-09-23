interface Str_to_Str_or_Num {
  [key: string]: string | number;
}

export function getConfigConstants(web_constants: Str_to_Str_or_Num, web_configs: Str_to_Str_or_Num, web_switches: Str_to_Str_or_Num): Str_to_Str_or_Num {
  let aws_to_web_constants: Str_to_Str_or_Num = {};

  for (let c_var in web_constants) {
    if (c_var.startsWith("C_") && c_var.includes("_web_")) {
      const c_value = web_constants[c_var];
      aws_to_web_constants[c_var] = c_value;
    }
  }

  for (let a_var in web_configs) {
    if (a_var.startsWith("C_") && a_var.includes("_web_")) {
      const a_value = web_configs[a_var];
      aws_to_web_constants[a_var] = a_value;
    }
  }

  for (let s_var in web_switches) {
    if (s_var.startsWith("C_") && s_var.includes("_web_")) {
      const s_value = web_switches[s_var];
      aws_to_web_constants[s_var] = s_value;
    }
  }

  aws_to_web_constants["C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK"] = "this_will_be_filled_in_by_pipelineTemplate()_in_the_aws_pipeline";


  return aws_to_web_constants;
}

