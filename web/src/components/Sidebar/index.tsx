import React from 'react';
import { SidebarContainer } from './styles';

const { C_cicd_web_AWS_Env_prd_dvl
} = require('../../../program.pipeline_2_web.json');





export const Sidebar: React.FC = () => {
  return <SidebarContainer>
    Environment {C_cicd_web_AWS_Env_prd_dvl}

  </SidebarContainer>;
};