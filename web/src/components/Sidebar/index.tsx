import React from 'react';
import { SidebarContainer } from './styles';

const { C_cicd_web_AWS_Env_prd_dvl
} = require('../../../program.web_values.json');





export const Sidebar: React.FunctionComponent = () => {
  return <SidebarContainer>
    [Env_prd]
    <br />
    <br />
    Environment
    <br />
    {C_cicd_web_AWS_Env_prd_dvl}

  </SidebarContainer>;
};