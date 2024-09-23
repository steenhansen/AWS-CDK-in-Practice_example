var fs = require('fs');

const stack_config = require('../cicd/program.config.json');
const C_cicd_STACK_NAME = stack_config.C_cicd_STACK_NAME;

var gulp = require('gulp');
const { printConfig } = require('../cicd/utils/env-errors');
const cdk_config = require('../cicd/cdk.json');
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const cdk_work_env = `"WORK_ENV": "${WORK_ENV}"`;

const web_constants = require('../cicd/program.constants.json');
const web_configs = require('../cicd/program.config.json');
const web_switches = require('../cicd/program.switches.json');
const { getConfigConstants } = require('../cicd/utils/getWebConsts');

const { C_cicd_PROG_PIPELINE_JSON } = require('../cicd/program.constants.json');

gulp.task('default', function (cb) {
  let aws_to_web_constants = getConfigConstants(web_constants, web_configs, web_switches);
  aws_to_web_constants["C_cicd_web_AWS_Env_prd_dvl"] = WORK_ENV;
  const stringified = JSON.stringify(aws_to_web_constants, null, 2);
  fs.writeFileSync(C_cicd_PROG_PIPELINE_JSON, stringified);
  printConfig(cdk_work_env, C_cicd_STACK_NAME);
  cb();
});


function printError(error_mess) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}

gulp.task('check-local-server', function (cb) {

  const {
    C_cicd_serv_HEALTH_CHECK_SLUG,
    C_serv_web_PORT_SERVER } = require('./program.pipeline_2_web.json');

  const health_url = 'http://localhost:' + C_serv_web_PORT_SERVER + "/" + C_cicd_serv_HEALTH_CHECK_SLUG;
  const get_url = 'http://localhost:' + C_serv_web_PORT_SERVER;


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

