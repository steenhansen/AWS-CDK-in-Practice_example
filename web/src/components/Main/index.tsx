import { getDbRgb, putDbRgb, clearDbRgb, currentRGB, getSpecialColorNumber, colorValues } from './clear';
import React, { useEffect, useState } from 'react';



import { ColorInt } from '../../../shapes';

import { CreateColorInt } from '../CreateColorInt';
import { MainContainer, BoxedColor, RgbBox, SpecialColor } from './styles';




const all_aws_constants = require('../../../program.web_values.json');
console.log(all_aws_constants);

const {
  C_cicd_web_DOMAIN_NAME,
  C_cicd_serv_web_CLEARDB_SLUG,
} = require('../../../program.web_values.json');



const [SSM_AWS_COLOR, SSM_AWS_NUMBER, backend_url] = getSpecialColorNumber();

const handle_clear = `${backend_url}/${C_cicd_serv_web_CLEARDB_SLUG}`;

export const Main: React.FunctionComponent = () => {
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
  };

  const handleClear = async () => {
    await clearDbRgb(handle_clear);
    setUserDatas([
      { id: 'clear-red', the_color: 'red', the_integer: 0 },
      { id: 'clear-green', the_color: 'green', the_integer: 0 },
      { id: 'clear-blue', the_color: 'blue', the_integer: 0 }
    ]);
  };

  let special_styles = {};
  if (SSM_AWS_COLOR !== "" && SSM_AWS_NUMBER !== "") {
    if (color_ints) {
      try {
        color_ints.forEach(an_object => {
          if (typeof an_object !== 'undefined') {
            const the_color: string = an_object.the_color;
            const the_integer = an_object.the_integer;

            const the_aws_as_number = Number(SSM_AWS_NUMBER);
            if (the_integer === the_aws_as_number) {
              const slack_text_mess = `${the_color} matches ${the_aws_as_number} for the color ${SSM_AWS_COLOR}`;
              special_styles = { color: SSM_AWS_COLOR };
              console.log(slack_text_mess, SSM_AWS_COLOR);
            }
          }
        });
      } catch (e) {
        console.log("color_ints error", e);
      }
    }
  } else {
    special_styles = { visibility: "hidden" };
  }

  const rgb_statment = currentRGB(color_ints);
  const rgb_styles = { backgroundColor: rgb_statment };
  const list_of_objects: Array<React.JSX.Element> = colorValues(color_ints);
  return (
    <MainContainer>

      <SpecialColor style={special_styles}>
        When a '{SSM_AWS_NUMBER}' exists then this text color is set to '{SSM_AWS_COLOR}'.
        <br /><br />
        '{SSM_AWS_NUMBER}' and '{SSM_AWS_COLOR}' are stored in the AWS Systems Manager/Parameter store.
        <br /><br />
        And are injected during the AWS pipeline, '{SSM_AWS_NUMBER}' and '{SSM_AWS_COLOR}' do not come from code.
      </SpecialColor>
      <br /><br />
      <br />



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
