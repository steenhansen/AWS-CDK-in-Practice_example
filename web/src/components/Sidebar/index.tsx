import React from 'react';
import { SidebarContainer } from './styles';

const { AWS_Env_prd_dvl
} = require('../../../program.pipeline.json');





export const Sidebar: React.FC = () => {
  return <SidebarContainer>
    Environment {AWS_Env_prd_dvl}

  </SidebarContainer>;
};