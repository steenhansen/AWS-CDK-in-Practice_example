import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Interfaces } from '../../../program.interfaces';

import { CreateColorInt } from '../CreateColorInt';
import { ColorInt } from '../ColorInt';

import { MainContainer, BoxedColor } from './styles';

import { directSlackMess } from '../../slack_mess';


import program_config from '../../../../infrastructure/program.config.json';
import the_constants from '../../../../infrastructure/program.constants.json';

const PORT_SERVER = the_constants.PORT_SERVER;

let DOMAIN_SUB_BACKEND = program_config.DOMAIN_SUB_BACKEND;
let DOMAIN_SUB_BACKEND_DEV = program_config.DOMAIN_SUB_BACKEND_DEV;
let DOMAIN_NAME = program_config.DOMAIN_NAME;
let STACK_NAME = program_config.STACK_NAME;


let backend_url: string;
let SSM_SLACK_WEBHOOK;



const { SECRET_PIPELINE_SLACK_WEBHOOK
} = require('../../../../infrastructure/program.pipeline.json');

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

const handle_clear = backend_url + "/clearDB";

export const Main: React.FC = () => {

  const [color_ints, setUserDatas] = useState<Interfaces.ColorInt[]>([]);
  useEffect(() => {
    const fetchColorInts = async () => {
      try {
        const response = await axios.get(backend_url);
        const all_data = response.data.color_ints;
        setUserDatas(all_data);
      } catch (e) {
        console.log("**** Is lserver running on localhost?", backend_url);
        console.log("**** Is 'DDB local' turned on in NoSQL Workbench?", e);
      };
    };
    fetchColorInts();
  }, []);

  const handleAdd = async ({
    new_color_int,
  }: {
    new_color_int: Interfaces.ColorInt;
  }) => {
    const response = await axios.post(backend_url, {
      color_int: new_color_int,
    });
    if (response.data.message) {
      console.log("**** ERROR:", response.data.message);
    } else {
      const new_obj = response.data.color_int;
      const trunc_list = color_ints.filter(an_object => an_object.the_color !== new_obj.the_color);
      const new_list = [...trunc_list, new_obj];

      console.log("new", new_list);    // background: rgb(31 120 50);

      let red = 0;
      let blue = 0;
      let green = 0;
      new_list.forEach((element) => console.log(element));

      setUserDatas(_ => new_list);
    }
  };

  const handleClear = async () => {
    await axios.get(handle_clear);
    directSlackMess(STACK_NAME + " - color list was cleared, contained " + color_ints.length + " element.");
    window.location.reload();
  };

  let rgb: any = { "red": 0, "green": 0, "blue": 0 };
  color_ints.forEach(an_object => {
    if (typeof an_object !== 'undefined') {
      const the_color: string = an_object.the_color;
      const the_integer = an_object.the_integer;
      rgb[the_color] = the_integer;
    }
  });
  const rgb_val = rgb["red"] + " " + rgb["green"] + " " + rgb["blue"];
  const rgb_statment = "rgb(" + rgb_val + ")";

  let list_of_objects: Array<React.JSX.Element> = [];
  color_ints.forEach(an_object => {
    if (typeof an_object !== 'undefined') {
      const color_html = <ColorInt color_int={an_object} key={an_object.id} />;
      list_of_objects.push(color_html);
    }
  }
  );

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

      <BoxedColor style={styles.exampleStyle}> </BoxedColor>

      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />
      <ul > {list_of_objects}</ul>
    </MainContainer >
  );





};
