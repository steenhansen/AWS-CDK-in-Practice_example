import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Interfaces } from '../../../program.interfaces';

import { CreateColorInt } from '../CreateColorInt';
import { ColorInt } from '../ColorInt';

import { MainContainer } from './styles';

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
// if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
//   backend_url = `http://localhost:${PORT_SERVER}`;
// } else {
//   let domain_sub_backend;
//   if (process.env.REACT_ENV === 'Production') {
//     domain_sub_backend = DOMAIN_SUB_BACKEND;
//   } else {
//     domain_sub_backend = DOMAIN_SUB_BACKEND_DEV;
//   }
//   backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
// }



const { SECRET_PIPELINE_SLACK_WEBHOOK
} = require('../../../../infrastructure/program.pipeline.json');

// yarn cross-env REACT_APP__SLACK_HOOK=https://hooks.slack.com   yarn local-web-start
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
  if (process.env.REACT_APP_ENV === 'Production') {
    domain_sub_backend = DOMAIN_SUB_BACKEND;
  } else {
    domain_sub_backend = DOMAIN_SUB_BACKEND_DEV;
  }
  console.log("cccccccccc 11111", domain_sub_backend);
  backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
  console.log("cccccccccc 222222", backend_url);
}


//const domain_sub_backend2 = DOMAIN_SUB_BACKEND;
//const backend_url2 = `https://${domain_sub_backend2}.${DOMAIN_NAME}`;
//console.log("cccccccccc", domain_sub_backend2, backend_url2);

const handle_clear = backend_url + "/clear";

export const Main: React.FC = () => {

  const [color_ints, setUserDatas] = useState<Interfaces.ColorInt[]>([]);
  useEffect(() => {
    const fetchColorInts = async () => {
      console.log("bbbbbbbbbbbbbbbbb 222222", process.env.REACT_APP_ENV);
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
      const new_list = color_ints.filter(an_object => an_object.the_color !== new_obj.the_color);
      setUserDatas(_ => [...new_list, new_obj]);
    }
  };

  const handleClear = async () => {
    await axios.get(handle_clear);
    directSlackMess(STACK_NAME + " - color list was cleared, contained " + color_ints.length + " element.");
    window.location.reload();
  };

  let list_of_objects: Array<React.JSX.Element> = [];
  color_ints.forEach(an_object => {
    if (typeof an_object !== 'undefined') {
      const color_html = <ColorInt color_int={an_object} key={an_object.id} />;
      list_of_objects.push(color_html);
    }
  }
  );



  return (
    <MainContainer >
      <h1>DynamoDB Values </h1>

      ssm <h2>{SSM_SLACK_WEBHOOK}</h2>
      constant<h2>{PORT_SERVER}</h2>

      config<h2>{DOMAIN_NAME}</h2>



      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />
      <ul > {list_of_objects}</ul>
    </MainContainer>
  );





};
