import { getDbRgb, putDbRgb, clearDbRgb, currentRGB, getApiUrl, colorValues } from './clear';
import React, { useEffect, useState } from 'react';



import { ColorInt } from '../../../shapes';

import { CreateColorInt } from '../CreateColorInt';
import { MainContainer, BoxedColor, RgbBox, WebHook } from './styles';


import { directSlackMess } from '../../slack_mess';


const all_aws_constants = require('../../../program.web_values.json');
console.log(all_aws_constants);

const {
  C_cicd_web_DOMAIN_NAME,
  C_web_SLACK_NUMBER,
  C_cicd_serv_web_CLEARDB_SLUG,
} = require('../../../program.web_values.json');


const SLACK_NUMBER = Number(C_web_SLACK_NUMBER);
const [SSM_SLACK_WEBHOOK, backend_url] = getApiUrl();

const handle_clear = `${backend_url}/${C_cicd_serv_web_CLEARDB_SLUG}`;

export const Main: React.FC = () => {
  const [color_ints, setUserDatas] = useState<ColorInt[]>([]);

  useEffect(() => {
    document.title = C_cicd_web_DOMAIN_NAME;
  }, []);

  useEffect(() => {
    const fetchColorInts = async () => {
      let all_data = await getDbRgb(backend_url);
      setUserDatas(all_data);
    };
    fetchColorInts();
  }, []);

  const handleAdd = async ({ new_color_int, }: { new_color_int: ColorInt; }) => {
    let new_obj = await putDbRgb({ new_color_int, backend_url });
    const trunc_list = color_ints.filter(an_object => an_object.the_color !== new_obj.the_color);
    const new_list = [...trunc_list, new_obj];
    setUserDatas(_ => new_list);

    if (SSM_SLACK_WEBHOOK !== "") {
      const { the_color, the_integer } = new_color_int;
      const as_number = Number(the_integer);
      if (as_number === SLACK_NUMBER) {
        const slack_text_mess = `${the_color} is ${C_web_SLACK_NUMBER}`;
        directSlackMess(SSM_SLACK_WEBHOOK, slack_text_mess);
      }
    }

  };

  const handleClear = async () => {
    await clearDbRgb(handle_clear);
    setUserDatas([
      { id: 'clear-red', the_color: 'red', the_integer: 0 },
      { id: 'clear-green', the_color: 'green', the_integer: 0 },
      { id: 'clear-blue', the_color: 'blue', the_integer: 0 }
    ]);
  };

  const rgb_statment = currentRGB(color_ints);
  const rgb_styles = { backgroundColor: rgb_statment };
  const list_of_objects: Array<React.JSX.Element> = colorValues(color_ints);

  return (
    <MainContainer >

      Slack Web Hook called when a {C_web_SLACK_NUMBER} is entered.
      Values stored in AWS Systems Manage / Parameter store, and is injected in pipeline, does not exist in GitHub.
      <WebHook>{SSM_SLACK_WEBHOOK}</WebHook>


      <BoxedColor style={rgb_styles} id={"the-color_box"}>
        <RgbBox data-testid={"test-color_box"}  >
          {rgb_statment}
        </RgbBox>
      </BoxedColor>
      <br></br>
      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />


      <ul onChange={e => console.log("e", e)} data-testid={"test-c_id"} id={"col_box_id"}> {list_of_objects}</ul>
    </MainContainer >
  );





};
