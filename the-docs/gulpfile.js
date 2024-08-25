

// yarn gulp clean

var fs = require('fs');
var gulp = require('gulp');


// var program_config = require('../program.config.json');
// program_config["GITHUB_secret_OAuthToken_Cred"] = "GITHUB_secret_OAuthToken_Cred";
// program_config["CICD_SLACK_PROD_CHANNEL_ID"] = "CICD_SLACK_PROD_CHANNEL_ID";
// program_config["CICD_SLACK_DEV_CHANNEL_ID"] = "CICD_SLACK_DEV_CHANNEL_ID";
// program_config["CICD_SLACK_WORKSPACE_ID_Cred"] = "CICD_SLACK_WORKSPACE_ID_Cred";
// program_config["SLACK_WEBHOOK_Cred"] = "SLACK_WEBHOOK_Cred";
// const program_stringified = JSON.stringify(program_config, null, 2);
// fs.writeFileSync('../program.config.json', program_stringified);

// var { GITHUB_secret_OAuthToken_Cred, CICD_SLACK_WORKSPACE_ID_Cred, SLACK_WEBHOOK_Cred
// } = require('../program.config.json');

// console.log("program: GITHUB_secret_OAuthToken_Cred", "\x1b[41m", GITHUB_secret_OAuthToken_Cred, "\x1b[0m");
// console.log("program: CICD_SLACK_WORKSPACE_ID_Cred", "\x1b[41m", CICD_SLACK_WORKSPACE_ID_Cred, "\x1b[0m");
// console.log("program: SLACK_WEBHOOK_Cred", "\x1b[41m", SLACK_WEBHOOK_Cred, "\x1b[0m");

// ///////////////////////////////////

// var cloud_config = require('../cloud/cloud.config.json');
// cloud_config["GITHUB_secret_OAuthToken_Cred"] = "GITHUB_secret_OAuthToken_Cred";
// cloud_config["CICD_SLACK_PROD_CHANNEL_ID"] = "CICD_SLACK_PROD_CHANNEL_ID";
// cloud_config["CICD_SLACK_DEV_CHANNEL_ID"] = "CICD_SLACK_DEV_CHANNEL_ID";
// cloud_config["CICD_SLACK_WORKSPACE_ID_Cred"] = "CICD_SLACK_WORKSPACE_ID_Cred";
// const cloud_stringified = JSON.stringify(cloud_config, null, 2);
// fs.writeFileSync('../cloud/cloud.config.json', cloud_stringified);

// var { GITHUB_secret_OAuthToken_Cred, CICD_SLACK_WORKSPACE_ID_Cred
// } = require('../cloud/cloud.config.json');

// console.log("");

// console.log("cloud: GITHUB_secret_OAuthToken_Cred", "\x1b[41m", GITHUB_secret_OAuthToken_Cred, "\x1b[0m");
// console.log("cloud: CICD_SLACK_WORKSPACE_ID_Cred", "\x1b[41m", CICD_SLACK_WORKSPACE_ID_Cred, "\x1b[0m");


// ///////////////////////////

// var server_config = require('../lbrowser/src/browser.config.json');
// server_config["SLACK_WEBHOOK_Cred"] = "SLACK_WEBHOOK_Cred";
// const server_stringified = JSON.stringify(server_config, null, 2);
// fs.writeFileSync('../lbrowser/src/browser.config.json', server_stringified);


// var { SLACK_WEBHOOK_Cred
// } = require('../lbrowser/src/browser.config.json');

// console.log("");

// console.log("lbrowser: SLACK_WEBHOOK_Cred", "\x1b[41m", SLACK_WEBHOOK_Cred, "\x1b[0m");





gulp.task('clean', function (cb) {
  fs.rmSync('../cloud/cdk.out/', { recursive: true, force: true });
  fs.rmSync('../cloud/node_modules/', { recursive: true, force: true });
  fs.rmSync('../lbrowser/node_modules/', { recursive: true, force: true });
  fs.rmSync('../lbrowser/build/', { recursive: true, force: true });
  fs.rmSync('../lserver/node_modules/', { recursive: true, force: true });
  console.log("cleaned");
  cb();
});




