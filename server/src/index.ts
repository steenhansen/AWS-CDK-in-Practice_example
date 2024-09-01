import create_app from './createApp';
import config from '../../infrastructure/program.config.json';
import the_constants from '../../infrastructure/program.constants.json';


let port: string;
if (process.env["SERVER_LOCAL_MODE"]?.toLowerCase() === 'yes') {
  port = the_constants.PORT_SERVER || '80';
} else {
  port = process.env.PORT || '80';

}


const app = create_app();
const server = app.listen(port, () => {
  console.info(`Local server is listening on port ${port}`);
});
server.keepAliveTimeout = 10;
server.headersTimeout = 10;
create_app();


// import create_app from './createApp';


// import the_constants from '../../program.constants.json';

// import program_config from '../../program.config.json';

// let port: string;

// let SSM_SLACK_WEBHOOK;
// if (process.env["SERVER_LOCAL_MODE"]?.toLowerCase() === 'yes') {
//   console.log("the loco modo");

//   if (typeof process.env["SERVER_LOCAL_MODE"] !== 'undefined') {
//     SSM_SLACK_WEBHOOK = process.env["SERVER__SLACK_HOOK"];
//   } else {
//     SSM_SLACK_WEBHOOK = "un-defined";
//   }

//   port = the_constants.PORT_SERVER || '80';
// } else {
//   console.log("on the server");
//   port = process.env.PORT || '80';

// }


// const app = create_app();
// const server = app.listen(port, () => {
//   console.info(`Local server is listening on port ${port}`);
// });

// console.log("program_config", program_config);
// console.log("the_constants", the_constants);
// console.log("SSM_SLACK_WEBHOOK", SSM_SLACK_WEBHOOK);


// server.keepAliveTimeout = 10;
// server.headersTimeout = 10;
// create_app();




