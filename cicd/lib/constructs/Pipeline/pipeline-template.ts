import { BuildSpec, LinuxBuildImage, } from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';


// interface Str_to_Str_or_Num {
//   [key: string]: string | number;
// }

import constants_config from '../../../program.constants.json';

// import web_constants from '../../../program.constants.json';
// import web_configs from '../../../program.config.json';
// import web_switches from '../../../program.switches.json';
// import { getConfigConstants } from '../../../utils/getWebConsts';


const C_cicd_NODE_RUNTIME = constants_config.C_cicd_NODE_RUNTIME;
const C_cicd_LINUX_VERSION = constants_config.C_cicd_LINUX_VERSION;
const C_cicd_web_AWS_VALUES_JSON = constants_config.C_cicd_web_AWS_VALUES_JSON;
interface Str_to_Obj {
  [key: string]: { [key: string]: string; };
}
function pipelineTemplate(cdk_role: Role, pipeline_name: string, aws_pipeline_2_web_vals: Str_to_Obj) {
  //let aws_to_web_constants: Str_to_Str_or_Num = getConfigConstants(web_constants, web_configs, web_switches);
  //aws_to_web_constants["C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK"] = SLACK_WEBHOOK;
  //console.log("354 SLACK_WEBHOOK=", SLACK_WEBHOOK);
  //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  // console.log("324 aws_to_web_constants=", aws_to_web_constants);
  const web_constants_k_v_str = JSON.stringify(aws_pipeline_2_web_vals, null, 2);
  console.log("789 web_constants_k_v_str=", web_constants_k_v_str);

  const copy_aws_to_web = `   '${web_constants_k_v_str}' > ${C_cicd_web_AWS_VALUES_JSON}  `;
  const copy_aws_to_web2 = ` '{ "C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK": "this_22will_be_filled_in"} ' > ./web/program.pipeline_2_web.json  `;
  const pipeline_structure = {
    projectName: pipeline_name,
    role: cdk_role,
    environment: { privileged: true, buildImage: LinuxBuildImage.fromCodeBuildImageId(C_cicd_LINUX_VERSION) },
    buildSpec: BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: { 'runtime-versions': { nodejs: C_cicd_NODE_RUNTIME } },
        pre_build: {
          'on-failure': 'ABORT',
          commands: [
            //   `echo ${copy_aws_to_web2}  `,         // the real one !!!
            'cd web',
            `echo ${copy_aws_to_web}   `,
            'yarn install',
            'cd ../server',
            'yarn install',
            'cd ../cicd',
            'yarn install']
        },
        build: {
          'on-failure': 'ABORT',
          commands: [
            `echo 'NNNN  build  '   `,
            'cd ../web',
            'yarn web-build-AWS',
            'cd ../cicd',
            'yarn cdk deploy']
        },
        post_build: {
          'on-failure': 'ABORT',
          commands: [
            `echo 'MMMMM  post_build  '   `
          ]
        },
      },
    }),
  };
  return pipeline_structure;
}

export { pipelineTemplate };