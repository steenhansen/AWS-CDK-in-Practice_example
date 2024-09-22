

const { C_serv_web_PORT_SERVER } = require('../../../program.pipeline_2_web.json');



export const backendLocal = () => {
  let SSM_SLACK_WEBHOOK: string;
  let backend_url: string;

  if (typeof process.env["REACT_APP__SLACK_HOOK"] !== 'undefined') {
    SSM_SLACK_WEBHOOK = process.env["REACT_APP__SLACK_HOOK"];
  } else {
    SSM_SLACK_WEBHOOK = "un-defined";
  }
  backend_url = `http://localhost:${C_serv_web_PORT_SERVER}`;

  return [SSM_SLACK_WEBHOOK, backend_url];
};