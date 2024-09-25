

const { C_cicd_web_SPECIAL_ALIVE } = require('../../../../cicd/program.switches.json');

const { C_serv_web_PORT_SERVER } = require('../../../../cicd/program.constants.json');


export const backendLocal = () => {
  let backend_url: string;

  let SPECIAL_AWS_COLOR = "";
  let SPECIAL_AWS_NUMBER = "";
  if (C_cicd_web_SPECIAL_ALIVE === "yes") {
    if (typeof process.env["REACT_APP__SPEC_COLOR"] !== 'undefined' && typeof process.env["REACT_APP__SPEC_NUM"] !== 'undefined') {
      SPECIAL_AWS_COLOR = process.env["REACT_APP__SPEC_COLOR"];
      SPECIAL_AWS_NUMBER = process.env["REACT_APP__SPEC_NUM"];
    }
  }
  backend_url = `http://localhost:${C_serv_web_PORT_SERVER}`;

  return [SPECIAL_AWS_COLOR, SPECIAL_AWS_NUMBER, backend_url];
};