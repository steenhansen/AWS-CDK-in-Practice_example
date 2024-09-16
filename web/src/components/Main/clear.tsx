
//import cdk_config from '../../../../cicd/cdk.json';
import React from 'react';
import { Interfaces } from '../../../program.interfaces';
//import { printError } from '../../../../cicd/utils/env-errors';        ///// bad
import the_constants from '../../../../cicd/program.constants.json';
import program_config from '../../../../cicd/program.config.json';
import { ColorInt } from '../ColorInt';

const { SECRET_PIPELINE_SLACK_WEBHOOK
} = require('../../../../cicd/program.pipeline.json');


const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;
const FETCH_TIMEOUT = the_constants.FETCH_TIMEOUT;
const SERVER_OFF_ERROR = the_constants.SERVER_OFF_ERROR;
const PORT_SERVER = the_constants.PORT_SERVER;

let DOMAIN_PROD_SUB_BACKEND = program_config.DOMAIN_PROD_SUB_BACKEND;
let DOMAIN_DEV_SUB_BACKEND = program_config.DOMAIN_DEV_SUB_BACKEND;
let DOMAIN_NAME = program_config.DOMAIN_NAME;

const ENVIRON_PRODUCTION = program_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = program_config.ENVIRON_DEVELOP;

//const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;  //////////////////bad
const WORK_ENV = "Env_prd";

export async function fastLocalFetch(backend_url: string, options: object) {
  if (process.env["REACT_APP__LOCAL_MODE"] !== "yes") {
    options = Object.assign(options, { signal: AbortSignal.timeout(FETCH_TIMEOUT) });
  }
  let response = await fetch(backend_url, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  return json;
}




export const getDbRgb = async (backend_url: string) => {
  try {
    let json;
    try {
      json = await fastLocalFetch(backend_url, {});
    } catch (error: any) {
      console.error(error.message);
    }
    const all_data = json.color_ints;
    return all_data;
  } catch (e) {
    const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR + " or " + SERVER_OFF_ERROR;
    //printError(error_mess, 'web/src/components/Main/index.tsx - useEffect()', backend_url);
    console.log(error_mess, 'web/src/components/Main/index.tsx - useEffect()', backend_url);
  };
  return {};
};








export const putDbRgb = async ({ new_color_int, backend_url }: {
  new_color_int: Interfaces.ColorInt; backend_url: string;
}) => {
  let json;
  try {
    let options = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ color_int: new_color_int }),
    };
    json = await fastLocalFetch(backend_url, options);
  } catch (error: any) {

    const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR + " or " + SERVER_OFF_ERROR;
    //    printError(error_mess, 'web/src/components/Main/index.tsx - handleAdd()', backend_url);
    console.log(error_mess, 'web/src/components/Main/index.tsx - handleAdd()', backend_url);
  };
  const new_obj = json.color_int;
  return new_obj;
};



export const clearDbRgb = async (handle_clear: string) => {
  let json;
  try {
    try {
      json = await fastLocalFetch(handle_clear, {});
    } catch (error: any) {
      console.error(error.message);
    }
    const all_data = json.color_ints;
    return all_data;
  } catch (e) {
    const error_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR + " or " + SERVER_OFF_ERROR;
    //    printError(error_mess, 'web/src/components/Main/index.tsx - handleClear()', "9078 backend_url");
    console.log(error_mess, 'web/src/components/Main/index.tsx - handleClear()', "9078 backend_url");
  };
  return {};
};

export const currentRGB = (color_ints: Interfaces.ColorInt[]) => {

  let rgb: any = { "red": 0, "green": 0, "blue": 0 };

  if (color_ints) {
    color_ints.forEach(an_object => {
      if (typeof an_object !== 'undefined') {
        const the_color: string = an_object.the_color;
        const the_integer = an_object.the_integer;
        rgb[the_color] = the_integer;
      }
    });
  }
  const rgb_val = rgb["red"] + " " + rgb["green"] + " " + rgb["blue"];
  const rgb_statment = "rgb(" + rgb_val + ")";

  return rgb_statment;


};



export const getApiUrl = () => {
  let backend_url: string;
  let SSM_SLACK_WEBHOOK;


  if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
    if (typeof process.env["REACT_APP__SLACK_HOOK"] !== 'undefined') {
      SSM_SLACK_WEBHOOK = process.env["REACT_APP__SLACK_HOOK"];
    } else {
      SSM_SLACK_WEBHOOK = "un-defined";
    }
    backend_url = `http://localhost:${PORT_SERVER}`;
  } else {
    if (SECRET_PIPELINE_SLACK_WEBHOOK !== "") {
      SSM_SLACK_WEBHOOK = SECRET_PIPELINE_SLACK_WEBHOOK;
    } else {
      SSM_SLACK_WEBHOOK = "un-defined";
    }
    let domain_sub_backend;

    if (WORK_ENV === ENVIRON_PRODUCTION) {
      domain_sub_backend = DOMAIN_PROD_SUB_BACKEND;
    } else if (WORK_ENV === ENVIRON_DEVELOP) {
      domain_sub_backend = DOMAIN_DEV_SUB_BACKEND;
    } else {
      const error_mess = "global_consts.WORK_ENV does not equal Env_prd or  Env_dvl";
      //      printError(error_mess, 'web/src/components/Main/clear.tsx - doinit()', WORK_ENV);
      console.log(error_mess, 'web/src/components/Main/clear.tsx - doinit()', WORK_ENV);
    }
    backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
  }
  return [SSM_SLACK_WEBHOOK, backend_url];
};


export function colorValues(color_ints: Interfaces.ColorInt[]) {
  let list_of_objects: Array<React.JSX.Element> = [];
  if (color_ints) {
    color_ints.forEach(an_object => {
      if (typeof an_object !== 'undefined') {
        const color_html = <ColorInt color_int={an_object} key={an_object.id} />;
        list_of_objects.push(color_html);
      }
    }
    );
  }
  return list_of_objects;
}