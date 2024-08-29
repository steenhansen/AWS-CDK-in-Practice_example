import create_app from './createApp';
//import config from './server.config.json';
//import program_config from '../../program.config.json';

import the_constants from '../../constants.json';



let port: string;
if (process.env["LOCAL_MODE"]?.toLowerCase() === 'yes') {
  console.log("the loco modo");
  port = the_constants.PORT_SERVER || '80';
} else {
  console.log("on the server");
  port = process.env.PORT || '80';

}


const app = create_app();
const server = app.listen(port, () => {
  console.info(`Local server is listening on port ${port}`);
});

console.log("sssssssssssssssssssssss", the_constants);
console.log("sssssssssssssssssssssss", port);


server.keepAliveTimeout = 10;
server.headersTimeout = 10;
create_app();




