import create_app from './createApp';
import the_constants from '../../cdk/program.constants.json';

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

