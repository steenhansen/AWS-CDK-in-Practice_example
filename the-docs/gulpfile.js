

// yarn gulp clean

var fs = require('fs');
var gulp = require('gulp');

var { GITHUB_secret_OAuthToken_Cred, CICD_SLACK_WORKSPACE_ID_Cred, SLACK_WEBHOOK_Cred
} = require('../program.config.json');

console.log("");

console.log("program: GITHUB_secret_OAuthToken_Cred", "\x1b[41m", GITHUB_secret_OAuthToken_Cred, "\x1b[0m");
console.log("program: CICD_SLACK_WORKSPACE_ID_Cred", "\x1b[41m", CICD_SLACK_WORKSPACE_ID_Cred, "\x1b[0m");
console.log("program: SLACK_WEBHOOK_Cred", "\x1b[41m", SLACK_WEBHOOK_Cred, "\x1b[0m");


var { GITHUB_secret_OAuthToken_Cred, CICD_SLACK_WORKSPACE_ID_Cred
} = require('../cloud/cloud.config.json');

console.log("");

console.log("cloud: GITHUB_secret_OAuthToken_Cred", "\x1b[41m", GITHUB_secret_OAuthToken_Cred, "\x1b[0m");
console.log("cloud: CICD_SLACK_WORKSPACE_ID_Cred", "\x1b[41m", CICD_SLACK_WORKSPACE_ID_Cred, "\x1b[0m");



var { SLACK_WEBHOOK_Cred
} = require('../lbrowser/src/browser.config.json');

console.log("");

console.log("lbrowser: SLACK_WEBHOOK_Cred", "\x1b[41m", SLACK_WEBHOOK_Cred, "\x1b[0m");





console.log("");

gulp.task('clean', function (cb) {
  fs.rmSync('../cloud/cdk.out/', { recursive: true, force: true });
  fs.rmSync('../cloud/node_modules/', { recursive: true, force: true });
  fs.rmSync('../lbrowser/node_modules/', { recursive: true, force: true });
  fs.rmSync('../lbrowser/build/', { recursive: true, force: true });
  fs.rmSync('../lserver/node_modules/', { recursive: true, force: true });
  console.log("cleaned");
  cb();
});




