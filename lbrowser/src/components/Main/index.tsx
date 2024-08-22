import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Interfaces } from '../../../program.interfaces';

import { CreateColorInt } from '../CreateColorInt';
import { ColorInt } from '../ColorInt';

import { MainContainer } from './styles';

import { directSlackMess } from '../../slack_mess';
import browser_config from '../../browser.config.json';
const PORT_SERVER = browser_config.PORT_SERVER;
let DOMAIN_SUB_BACKEND = browser_config.DOMAIN_SUB_BACKEND;
let DOMAIN_SUB_BACKEND_DEV = browser_config.DOMAIN_SUB_BACKEND_DEV;
let DOMAIN_NAME = browser_config.DOMAIN_NAME;
let STACK_NAME = browser_config.STACK_NAME;


let backend_url: string;
if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
  backend_url = `http://localhost:${PORT_SERVER}`;
} else {
  let domain_sub_backend;
  if (process.env.REACT_ENV === 'Prod') {
    domain_sub_backend = DOMAIN_SUB_BACKEND;
  } else {
    domain_sub_backend = DOMAIN_SUB_BACKEND_DEV;
  }
  backend_url = `https://${domain_sub_backend}.${DOMAIN_NAME}`;
}



const handle_clear = backend_url + "/clear";

export const Main: React.FC = () => {

  const [color_ints, setUserDatas] = useState<Interfaces.ColorInt[]>([]);

  useEffect(() => {
    const fetchColorInts = async () => {
      try {
        const response = await axios.get(backend_url);
        const all_data = response.data.color_ints;
        setUserDatas(all_data);
      } catch (e) {
        console.log("**** Is lserver running on localhost?");
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
      const new_list = color_ints.filter(an_object => an_object.the_color != new_obj.the_color);
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


      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />

      <ul > {list_of_objects}</ul>






    </MainContainer>
  );






};
