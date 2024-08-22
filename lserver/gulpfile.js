
var fs = require('fs');
var gulp = require('gulp');


const {
  PORT_SERVER, PORT_TEST, AWS_REGION
} = require('../constants.json');




const { STACK_NAME, DOMAIN_SUB_BACKEND, DOMAIN_SUB_BACKEND_DEV } = require('../program.config.json');

const the_json = {
  "DOMAIN_SUB_BACKEND": DOMAIN_SUB_BACKEND,
  "DOMAIN_SUB_BACKEND_DEV": DOMAIN_SUB_BACKEND_DEV,
  "AWS_REGION": AWS_REGION,
  "STACK_NAME": STACK_NAME,
  "PORT_SERVER": PORT_SERVER,
  "PORT_TEST": PORT_TEST
};

gulp.task('default', function (cb) {
  const stringified = JSON.stringify(the_json, null, 2);
  fs.writeFileSync('./src/server.config.json', stringified);
  console.log("\x1b[41m", "**** Note that lserver does not exist on AWS code");
  console.log(" **** Hit rs to reload changed cloud code");
  console.log(" **** /src/server.config.json", "\x1b[0m");
  cb();
});



