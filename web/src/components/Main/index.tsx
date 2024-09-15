import { getDbRgb, putDbRgb, clearDbRgb, currentRGB, getApiUrl, colorValues } from './clear';
import React, { useEffect, useState } from 'react';
import { Interfaces } from '../../../program.interfaces';
import { CreateColorInt } from '../CreateColorInt';
import { MainContainer, BoxedColor, Zxc } from './styles';
import program_config from '../../../../cicd/program.config.json';
import the_constants from '../../../../cicd/program.constants.json';

const PORT_SERVER = the_constants.PORT_SERVER;
const CLEARDB_SLUG = the_constants.CLEARDB_SLUG;
let DOMAIN_NAME = program_config.DOMAIN_NAME;

const [SSM_SLACK_WEBHOOK, backend_url] = getApiUrl();

const handle_clear = `${backend_url}/${CLEARDB_SLUG}`;

export const Main: React.FC = () => {

  // const initial_state = await getDbRgb(backend_url);

  const [color_ints, setUserDatas] = useState<Interfaces.ColorInt[]>([]);
  useEffect(() => {
    const fetchColorInts = async () => {
      let all_data = await getDbRgb(backend_url);
      setUserDatas(all_data);
    };
    fetchColorInts();
  }, []);

  const handleAdd = async ({ new_color_int, }: { new_color_int: Interfaces.ColorInt; }) => {
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

  const rgb_statment = currentRGB(color_ints);
  const rgb_styles = { backgroundColor: rgb_statment };
  const list_of_objects: Array<React.JSX.Element> = colorValues(color_ints);

  return (
    <MainContainer >
      <h1>DynamoDB Values </h1>

      ssm <h2>{SSM_SLACK_WEBHOOK}</h2>
      constant<h2>{PORT_SERVER}</h2>

      config<h2>{DOMAIN_NAME}</h2>

      <BoxedColor style={rgb_styles} id={"the-color_box"}>
        <Zxc data-testid={"test-color_box"}  >
          {rgb_statment}
        </Zxc>
      </BoxedColor>
      <br></br>
      <CreateColorInt handleAdd={handleAdd} handleClear={handleClear} />


      <ul onChange={e => console.log("e", e)} data-testid={"test-c_id"} id={"col_box_id"}> {list_of_objects}</ul>
    </MainContainer >
  );





};
