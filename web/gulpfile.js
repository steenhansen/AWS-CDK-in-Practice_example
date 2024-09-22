var fs = require('fs');

let web_constants = require('../cicd/program.constants.json');
let web_configs = require('../cicd/program.config.json');
let web_switches = require('../cicd/program.switches.json');



const getConfigConstants = require('../cicd/utils/getWebConsts');



const stack_config = require('../cicd/program.config.json');
const C_cicd_STACK_NAME = stack_config.C_cicd_STACK_NAME;

var gulp = require('gulp');
const { printConfig } = require('../cicd/utils/env-errors');
const cdk_config = require('../cicd/cdk.json');
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

const { C_cicd_web_DOMAIN_PROD_SUB_BACKEND,
  C_cicd_web_DOMAIN_DEV_SUB_BACKEND,
  C_cicd_web_DOMAIN_NAME,
  C_cicd_web_ENVIRON_PRODUCTION,
  C_cicd_web_ENVIRON_DEVELOP,
  C_cicd_web_SLACK_WEB_HOOK_ALIVE,
  C_cicd_serv_web_TESTING_ALIVE
} = require('../cicd/program.config.json');

const {
  C_cicd_serv_HEALTH_CHECK_SLUG,
  C_cicd_serv_web_CLEARDB_SLUG,
  C_cicd_serv_web_NO_SQL_OFF_ERROR,
  C_cicd_serv_web_VPN_ON_ERROR,
  C_cicd_web_FETCH_TIMEOUT,
  C_web_SERVER_OFF_ERROR,
  C_serv_web_PORT_SERVER } = require('../cicd/program.constants.json');



gulp.task('default', function (cb) {
  aws_to_web_constants = getConfigConstants(web_constants, web_configs, web_switches);
  console.log(aws_to_web_constants);

  const slack_webhook_k_v_obj =
  {
    C_cicd_web_AWS_Env_prd_dvl: WORK_ENV,
    C_cicd_web_DOMAIN_PROD_SUB_BACKEND: C_cicd_web_DOMAIN_PROD_SUB_BACKEND,
    C_cicd_web_DOMAIN_DEV_SUB_BACKEND: C_cicd_web_DOMAIN_DEV_SUB_BACKEND,
    C_cicd_web_DOMAIN_NAME: C_cicd_web_DOMAIN_NAME,
    C_cicd_web_ENVIRON_PRODUCTION: C_cicd_web_ENVIRON_PRODUCTION,
    C_cicd_web_ENVIRON_DEVELOP: C_cicd_web_ENVIRON_DEVELOP,
    C_cicd_serv_web_CLEARDB_SLUG: C_cicd_serv_web_CLEARDB_SLUG,
    C_cicd_serv_web_NO_SQL_OFF_ERROR: C_cicd_serv_web_NO_SQL_OFF_ERROR,
    C_cicd_serv_web_VPN_ON_ERROR: C_cicd_serv_web_VPN_ON_ERROR,
    C_cicd_web_FETCH_TIMEOUT: C_cicd_web_FETCH_TIMEOUT,
    C_web_SERVER_OFF_ERROR: C_web_SERVER_OFF_ERROR,
    C_cicd_web_SLACK_WEB_HOOK_ALIVE: C_cicd_web_SLACK_WEB_HOOK_ALIVE,
    C_serv_web_PORT_SERVER: C_serv_web_PORT_SERVER,
    C_cicd_serv_web_TESTING_ALIVE: C_cicd_serv_web_TESTING_ALIVE,
    C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK: "_SLACK_WEBHOOK_"
  };
  const stringified = JSON.stringify(slack_webhook_k_v_obj, null, 2);
  fs.writeFileSync('./program.pipeline.json', stringified);
  printConfig(WORK_ENV, C_cicd_STACK_NAME);
  cb();
});



// const { PORT_SERVER, HEALTH_CHECK_SLUG, VPN_ON_ERROR, NO_SQL_OFF_ERROR, SERVER_OFF_ERROR } = require('../cicd/program.constants.json');

const health_url = 'http://localhost:' + C_serv_web_PORT_SERVER + "/" + C_cicd_serv_HEALTH_CHECK_SLUG;
const get_url = 'http://localhost:' + C_serv_web_PORT_SERVER;

function printError(error_mess) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}

gulp.task('check-local-server', function (cb) {
  fetch(health_url, { signal: AbortSignal.timeout(1000) })
    .catch(_ => {
      printError(C_web_SERVER_OFF_ERROR);
      cb();
      throw C_web_SERVER_OFF_ERROR;
    }).then(_ => {
      fetch(get_url, { signal: AbortSignal.timeout(1000) }).catch(_ => {
        const prob_mess = C_cicd_serv_web_NO_SQL_OFF_ERROR + " or " + C_cicd_serv_web_VPN_ON_ERROR;
        printError(prob_mess);
        cb();
        throw prob_mess;
      });
    });
  cb();
});



// //////////////////////////
// let web_constants = require('../cicd/program.constants.json');
// let web_configs = require('../cicd/program.config.json');
// let web_switches = require('../cicd/program.switches.json');

// function getConfigConstants2() {
//   let slack_webhook_k_v_obj2 = {};

//   for (let c_var in web_constants) {
//     if (c_var.startsWith("C_") && c_var.includes("_web_")) {
//       const c_value = web_constants[c_var];
//       slack_webhook_k_v_obj2[c_var] = c_value;
//     }
//   }

//   for (let a_var in web_configs) {
//     if (a_var.startsWith("C_") && a_var.includes("_web_")) {
//       const a_value = web_configs[a_var];
//       slack_webhook_k_v_obj2[a_var] = a_value;
//     }
//   }

//   for (let s_var in web_switches) {
//     if (s_var.startsWith("C_") && s_var.includes("_web_")) {
//       const s_value = web_switches[s_var];
//       slack_webhook_k_v_obj2[s_var] = s_value;
//     }
//   }
//   console.log(213, slack_webhook_k_v_obj2);
// }

// //yarn gulp cc
// gulp.task('cc', function (cb) {
//   getConfigConstants2();
//   cb();
// });