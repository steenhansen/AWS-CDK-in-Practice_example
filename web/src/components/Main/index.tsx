import React, { useEffect, useState } from 'react';


import { Interfaces } from '../../../program.interfaces';

import { CreateColorInt } from '../CreateColorInt';
import { ColorInt } from '../ColorInt';

import { MainContainer, BoxedColor, Zxc } from './styles';


import program_config from '../../../../cdk/program.config.json';
import the_constants from '../../../../cdk/program.constants.json';

const PORT_SERVER = the_constants.PORT_SERVER;
const CLEARDB_SLUG = the_constants.CLEARDB_SLUG;

const NO_SQL_OFF_ERROR = the_constants.NO_SQL_OFF_ERROR;
const VPN_ON_ERROR = the_constants.VPN_ON_ERROR;

const SERVER_OFF_ERROR = the_constants.SERVER_OFF_ERROR;

let DOMAIN_SUB_BACKEND = program_config.DOMAIN_SUB_BACKEND;
let DOMAIN_SUB_BACKEND_DEV = program_config.DOMAIN_SUB_BACKEND_DEV;
let DOMAIN_NAME = program_config.DOMAIN_NAME;


let backend_url: string;
let SSM_SLACK_WEBHOOK;



const { SECRET_PIPELINE_SLACK_WEBHOOK
} = require('../../../../cdk/program.pipeline.json');

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
  if (process.env.REACT_APP_ENV === 'Env_prd') {
    domain_sub_backend = DOMAIN_SUB_BACKEND;
  } else {
    domain_sub_backend = DOMAIN_SUB_BACKEND_DEV;
  }
  backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
}


const handle_clear = `${backend_url}/${CLEARDB_SLUG}`;

function printError(error_mess: string) {
  console.log('\x1b[41m %s \x1b[0m', "**** " + error_mess);
}


export const Main: React.FC = () => {

  const [color_ints, setUserDatas] = useState<Interfaces.ColorInt[]>([]);
  useEffect(() => {
    const fetchColorInts = async () => {
      try {
        let json;
        try {
          const response = await fetch(backend_url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          json = await response.json();
        } catch (error: any) {
          console.error(error.message);
        }
        const all_data = json.color_ints;
        setUserDatas(all_data);
      } catch (e) {
        const prob_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR + " or " + SERVER_OFF_ERROR + " : " + backend_url;
        printError(prob_mess);
      };
    };
    fetchColorInts();
  }, []);

  const handleAdd = async ({
    new_color_int,
  }: {
    new_color_int: Interfaces.ColorInt;
  }) => {
    let json;
    try {
      const response = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ color_int: new_color_int }),
      }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json = await response.json();
    } catch (error: any) {
      console.error(error.message);
    }
    if (false) {
      // console.log("**** ERROR:", response.data.message);
    } else {
      const new_obj = json.color_int;
      const trunc_list = color_ints.filter(an_object => an_object.the_color !== new_obj.the_color);
      const new_list = [...trunc_list, new_obj];
      setUserDatas(_ => new_list);
    }
  };

  let rgb: any = { "red": 0, "green": 0, "blue": 0 };

  const handleClear = async () => {
    let json;
    try {
      try {
        const response = await fetch(handle_clear);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        json = await response.json();
      } catch (error: any) {
        console.error(error.message);
      }
      const all_data = json.color_ints;
      setUserDatas(all_data);
    } catch (e) {
      const prob_mess = NO_SQL_OFF_ERROR + " or " + VPN_ON_ERROR + " or " + SERVER_OFF_ERROR + " : " + backend_url;
      printError(prob_mess);
    };
    setUserDatas([
      { id: 'clear-red', the_color: 'red', the_integer: 0 },
      { id: 'clear-green', the_color: 'green', the_integer: 0 },
      { id: 'clear-blue', the_color: 'blue', the_integer: 0 }
    ]);
  };

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

  const styles = {
    exampleStyle: {
      backgroundColor: rgb_statment
    }
  };


  return (
    <MainContainer >
      <h1>DynamoDB Values </h1>

      ssm <h2>{SSM_SLACK_WEBHOOK}</h2>
      constant<h2>{PORT_SERVER}</h2>

      config<h2>{DOMAIN_NAME}</h2>

      <BoxedColor style={styles.exampleStyle} id={"the-color_box"}>
        <Zxc data-testid={"test-color_box"}  >
          {rgb_statment}
        </Zxc>
      </BoxedColor>

      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />
      <ul onChange={e => console.log("e", e)} data-testid={"test-c_id"} id={"col_box_id"}> {list_of_objects}</ul>
    </MainContainer >
  );





};
