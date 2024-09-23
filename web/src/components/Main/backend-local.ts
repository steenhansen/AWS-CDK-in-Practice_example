

const { C_cicd_web_SLACK_WEB_HOOK_ALIVE } = require('../../../../cicd/program.switches.json');

const { C_serv_web_PORT_SERVER } = require('../../../../cicd/program.constants.json');


export const backendLocal = () => {
  let backend_url: string;

  let SSM_SLACK_WEBHOOK = "";
  // console.log("bbbbbbbbbbbbbb    ", C_cicd_web_SLACK_WEB_HOOK_ALIVE);
  if (C_cicd_web_SLACK_WEB_HOOK_ALIVE === "yes") {
    // console.log("ccccccccccccccc    ", typeof process.env["REACT_APP__SLACK_HOOK"]);
    if (typeof process.env["REACT_APP__SLACK_HOOK"] !== 'undefined') {
      SSM_SLACK_WEBHOOK = process.env["REACT_APP__SLACK_HOOK"];
      // console.log("dddddddddddddddd x ccc  ", SSM_SLACK_WEBHOOK);
    }
  }
  backend_url = `http://localhost:${C_serv_web_PORT_SERVER}`;

  return [SSM_SLACK_WEBHOOK, backend_url];
};