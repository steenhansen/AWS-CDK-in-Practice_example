

const { PORT_SERVER } = require('../../../program.pipeline.json');



export const backendLocal = () => {
  let SSM_SLACK_WEBHOOK: string;
  let backend_url: string;

  if (typeof process.env["REACT_APP__SLACK_HOOK"] !== 'undefined') {
    SSM_SLACK_WEBHOOK = process.env["REACT_APP__SLACK_HOOK"];
  } else {
    SSM_SLACK_WEBHOOK = "un-defined";
  }
  backend_url = `http://localhost:${PORT_SERVER}`;

  return [SSM_SLACK_WEBHOOK, backend_url];
};