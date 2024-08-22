
// npx gulp to copy down the configs without TypeScript copying every value

var fs = require('fs');
var gulp = require('gulp');



const {
  PORT_SERVER, _PORT_BROWSER_
} = require('../constants.json');


const { DOMAIN_NAME, DOMAIN_SUB_BACKEND, DOMAIN_SUB_BACKEND_DEV,
  SLACK_WEBHOOK_Cred, STACK_NAME, SLACK_WEB_HOOK_ALIVE,
} = require('../program.config.json');

const the_json = {
  "DOMAIN_NAME": DOMAIN_NAME,
  "DOMAIN_SUB_BACKEND": DOMAIN_SUB_BACKEND,
  "DOMAIN_SUB_BACKEND_DEV": DOMAIN_SUB_BACKEND_DEV,
  "PORT_SERVER": PORT_SERVER,
  "_PORT_BROWSER_": _PORT_BROWSER_,
  "SLACK_WEBHOOK_Cred": SLACK_WEBHOOK_Cred,
  "STACK_NAME": STACK_NAME,
  "SLACK_WEB_HOOK_ALIVE": SLACK_WEB_HOOK_ALIVE,
};

gulp.task('default', function (cb) {
  const stringified = JSON.stringify(the_json, null, 2);
  fs.writeFileSync('./src/browser.config.json', stringified);
  console.log("browser.config.json");
  cb();
});



