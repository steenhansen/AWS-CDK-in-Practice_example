

const stack_config = require('../cicd/program.config.json');
const STACK_NAME = stack_config.STACK_NAME;

var gulp = require('gulp');
const { printConfig } = require('../cicd/utils/env-errors');
const cdk_config = require('../cicd/cdk.json');
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

gulp.task('default', function (cb) {
  printConfig(WORK_ENV, STACK_NAME);
  cb();
});



const { PORT_SERVER, HEALTH_CHECK_SLUG, VPN_ON_ERROR, NO_SQL_OFF_ERROR, SERVER_OFF_ERROR } = require('../cicd/program.constants.json');

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

