
import React from 'react';
import { Interfaces } from '../../../program.interfaces';
import the_constants from '../../../../cicd/program.constants.json';
import { ColorInt } from '../ColorInt';

import { backendLocal } from './backend-local';
import { backendAWS } from './backend-aws';


const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;
const FETCH_TIMEOUT = the_constants.FETCH_TIMEOUT;
const SERVER_OFF_ERROR = the_constants.SERVER_OFF_ERROR;

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