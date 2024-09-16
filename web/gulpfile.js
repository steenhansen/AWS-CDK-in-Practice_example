var fs = require('fs');

const stack_config = require('../cicd/program.config.json');
const STACK_NAME = stack_config.STACK_NAME;

var gulp = require('gulp');
const { printConfig } = require('../cicd/utils/env-errors');
const cdk_config = require('../cicd/cdk.json');
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;



const { DOMAIN_PROD_SUB_BACKEND,
  DOMAIN_DEV_SUB_BACKEND,
  DOMAIN_NAME,
  ENVIRON_PRODUCTION,
  ENVIRON_DEVELOP, SLACK_WEB_HOOK_ALIVE, TESTING_ALIVE
} = require('../cicd/program.config.json');

const { HEALTH_CHECK_SLUG, CLEARDB_SLUG, NO_SQL_OFF_ERROR, VPN_ON_ERROR, FETCH_TIMEOUT, SERVER_OFF_ERROR, PORT_SERVER } = require('../cicd/program.constants.json');



gulp.task('default', function (cb) {
  const slack_webhook_k_v_obj =
  {
    AWS_Env_prd_dvl: WORK_ENV,
    DOMAIN_PROD_SUB_BACKEND: DOMAIN_PROD_SUB_BACKEND,
    DOMAIN_DEV_SUB_BACKEND: DOMAIN_DEV_SUB_BACKEND,
    DOMAIN_NAME: DOMAIN_NAME,
    ENVIRON_PRODUCTION: ENVIRON_PRODUCTION,
    ENVIRON_DEVELOP: ENVIRON_DEVELOP,
    CLEARDB_SLUG: CLEARDB_SLUG,
    NO_SQL_OFF_ERROR: NO_SQL_OFF_ERROR,
    VPN_ON_ERROR: VPN_ON_ERROR,
    FETCH_TIMEOUT: FETCH_TIMEOUT,
    SERVER_OFF_ERROR: SERVER_OFF_ERROR,
    SLACK_WEB_HOOK_ALIVE: SLACK_WEB_HOOK_ALIVE,
    PORT_SERVER: PORT_SERVER,
    TESTING_ALIVE: TESTING_ALIVE,
    SECRET_PIPELINE_SLACK_WEBHOOK: "_SLACK_WEBHOOK_"
  };
  const stringified = JSON.stringify(slack_webhook_k_v_obj, null, 2);
  fs.writeFileSync('./program.pipeline.json', stringified);
  printConfig(WORK_ENV, STACK_NAME);
  cb();
});



// const { PORT_SERVER, HEALTH_CHECK_SLUG, VPN_ON_ERROR, NO_SQL_OFF_ERROR, SERVER_OFF_ERROR } = require('../cicd/program.constants.json');

const health_url = 'http://localhost:' + PORT_SERVER + "/" + HEALTH_CHECK_SLUG;
const get_url = 'http://localhost:' + PORT_SERVER;

function printError(error_mess) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}

gulp.task('check-local-server', function (cb) {
  fetch(health_url, { signal: AbortSignal.timeout(1000) })
    .catch(_ => {
      printError(SERVER_OFF_ERROR);
      cb();
      throw SERVER_OFF_ERROR;
    }).then(_ => {
      fetch(get_url, { signal: AbortSignal.timeout(1000) }).catch(_ => {
        const prob_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR;
        printError(prob_mess);
        cb();
        throw prob_mess;
      });
    });
  cb();
});

