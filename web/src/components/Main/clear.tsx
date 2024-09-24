
import React from 'react';
import { ColorBox } from '../ColorBox';
import { ColorInt, Str_to_Int } from '../../../shapes';

import { backendLocal } from './backend-local';
import { backendAWS } from './backend-aws';

const { C_cicd_serv_web_NO_SQL_OFF_ERROR, C_cicd_serv_web_VPN_ON_ERROR,
  C_cicd_web_FETCH_TIMEOUT,
  C_web_SERVER_OFF_ERROR
} = require('../../../program.web_values.json');





export const getApiUrl = () => {
  if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
    const [SSM_SLACK_WEBHOOK, backend_url_local] = backendLocal();
    return [SSM_SLACK_WEBHOOK, backend_url_local];
  } else {
    const [SSM_SLACK_WEBHOOK, backend_url_aws] = backendAWS();
    return [SSM_SLACK_WEBHOOK, backend_url_aws];
  }
};

export async function fastLocalFetch(backend_url: string, options: object) {
  if (process.env["REACT_APP__LOCAL_MODE"] === "yes") {
    console.error("doing abort on timeout", C_cicd_web_FETCH_TIMEOUT);
    options = Object.assign(options, { signal: AbortSignal.timeout(C_cicd_web_FETCH_TIMEOUT) });
  }
  let response = await fetch(backend_url, options);
  if (!response.ok) {
    console.error(response);
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  return json;
}

export const getDbRgb = async (backend_url: string) => {
  try {
    let json;
    try {
      console.error(backend_url);
      json = await fastLocalFetch(backend_url, {});
      console.error(json);
    } catch (error: any) {
      console.error(error.message);
    }
    const all_data = json.color_ints;
    return all_data;
  } catch (e) {
    const error_mess = C_cicd_serv_web_NO_SQL_OFF_ERROR + " or " + C_cicd_serv_web_VPN_ON_ERROR + " or " + C_web_SERVER_OFF_ERROR;
    console.log(error_mess, 'web/src/components/Main/index.tsx - useEffect()', backend_url);
  };
  return {};
};

export const putDbRgb = async ({ new_color_int, backend_url }: {
  new_color_int: ColorInt; backend_url: string;
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

    const error_mess = C_cicd_serv_web_NO_SQL_OFF_ERROR + " or " + C_cicd_serv_web_VPN_ON_ERROR + " or " + C_web_SERVER_OFF_ERROR;
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
    const error_mess = C_cicd_serv_web_NO_SQL_OFF_ERROR + " or " + C_cicd_serv_web_VPN_ON_ERROR + " or " + C_web_SERVER_OFF_ERROR;
    console.log(error_mess, 'web/src/components/Main/index.tsx - handleClear()', "9078 backend_url");
  };
  return {};
};


export const currentRGB = (color_ints: ColorInt[]) => {
  let rgb: Str_to_Int = { "red": 0, "green": 0, "blue": 0 };
  if (color_ints) {
    try {
      color_ints.forEach(an_object => {
        if (typeof an_object !== 'undefined') {
          const the_color: string = an_object.the_color;
          const the_integer = an_object.the_integer;
          rgb[the_color] = the_integer;
        }
      });
    } catch (e) {
      console.log(C_cicd_serv_web_NO_SQL_OFF_ERROR, e);
    }
  }
  const rgb_val = rgb["red"] + " " + rgb["green"] + " " + rgb["blue"];
  const rgb_statment = "rgb(" + rgb_val + ")";
  return rgb_statment;
};

export function colorValues(color_ints: ColorInt[]) {
  let list_of_objects: Array<React.JSX.Element> = [];
  if (color_ints) {
    try {
      color_ints.forEach(an_object => {
        if (typeof an_object !== 'undefined') {
          const color_html = <ColorBox color_int={an_object} key={an_object.id} />;
          list_of_objects.push(color_html);
        }
      }
      );
    } catch (e) {
      console.log(C_cicd_serv_web_NO_SQL_OFF_ERROR, e);
    }
  }
  return list_of_objects;
}