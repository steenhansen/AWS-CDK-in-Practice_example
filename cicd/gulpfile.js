
var gulp = require('gulp');


const { printConfig, printError } = require('./utils/env-errors');
const cdk_config = require('./cdk.json');

const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS = cdk_config.context.environment_consts;
const ACCOUNT_NUMBER = THE_ENVIRONMENTS[WORK_ENV].ACCOUNT_NUMBER;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;

const stack_config = require('./program.config.json');
const C_cicd_web_DOMAIN_NAME = stack_config.C_cicd_web_DOMAIN_NAME;
const C_cicd_STACK_NAME = stack_config.C_cicd_STACK_NAME;

const C_cicd_GITHUB_REPO = stack_config.C_cicd_GITHUB_REPO;
const C_cicd_GITHUB_OWNER = stack_config.C_cicd_GITHUB_OWNER;
const cdk_work_env = `"WORK_ENV": "${WORK_ENV}"`;


const stack_constants = require('./program.constants.json');
const C_cicd_REGION_US_EAST_1 = stack_constants.C_cicd_REGION_US_EAST_1;

gulp.task('to-local', function (cb) {
  printConfig(cdk_work_env, C_cicd_STACK_NAME);
  cb();
});




gulp.task('to-cloud', function (cb) {
  cloudOrPipeline();

  printConfig(cdk_work_env, C_cicd_STACK_NAME);
  printConfig("Was /web compiled?", "For new compressed home page");

  cb();
});


gulp.task('to-pipeline', function (cb) {

  cloudOrPipeline();

  if (C_cicd_GITHUB_REPO === "your-github-repo") {
    printError("Change C_cicd_GITHUB_REPO in /cicd/program.config.json", C_cicd_GITHUB_REPO, "it won't work");
    throw "GitHub repo is wrong";
  }
  if (C_cicd_GITHUB_OWNER === "your-github-name") {
    printError("Change C_cicd_GITHUB_OWNER in /cicd/program.config.json", C_cicd_GITHUB_OWNER, "it won't work");
    throw "GitHub owner is wrong";
  }

  printConfig(cdk_work_env, C_cicd_STACK_NAME);
  printConfig("Was /web compiled?", "For new compressed home page");

  cb();
});

function cloudOrPipeline() {
  if (AWS_REGION !== C_cicd_REGION_US_EAST_1) {
    const region_what = "Change AWS_REGION(s) in /cicd/cdk.json";
    const region_to = `to '${C_cicd_REGION_US_EAST_1}' or Route 53 won't work`;
    printError(region_what, AWS_REGION, region_to);
    throw "AWS account number is wrong";
  }

  if (ACCOUNT_NUMBER === "999999999999") {
    printError("Change ACCOUNT_NUMBER in /cicd/cdk.json", ACCOUNT_NUMBER, "it won't work");
    throw "AWS account number is wrong";
  }

  if (C_cicd_web_DOMAIN_NAME === "your-domain.click") {
    printError("Change C_cicd_web_DOMAIN_NAME in /cicd/program.config.json", C_cicd_web_DOMAIN_NAME, "it won't work");
    throw "AWS domain name is wrong";
  }
}