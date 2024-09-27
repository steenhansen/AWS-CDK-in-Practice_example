
var gulp = require('gulp');

const stack_config = require('../cicd/program.config.json');
const C_cicd_STACK_NAME = stack_config.C_cicd_STACK_NAME;


const { printConfig } = require('../cicd/utils/env-errors');
const cdk_config = require('../cicd/cdk.json');
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const cdk_work_env = `"WORK_ENV": "${WORK_ENV}"`;


gulp.task('default', function (cb) {
  printConfig(cdk_work_env, C_cicd_STACK_NAME);
  printConfig("Note that the /server code does nothing on AWS except a test", "health check route");
  cb();
});



