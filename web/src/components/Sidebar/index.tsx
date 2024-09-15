import React from 'react';
import cdk_config from '../../../../cicd/cdk.json';
import program_config from '../../../../cicd/program.config.json';
import { printError } from '../../../../cicd/utils/env-errors';
import { SidebarContainer } from './styles';

const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const ENVIRON_PRODUCTION = program_config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = program_config.ENVIRON_DEVELOP;

let program_type = "";
if (WORK_ENV === ENVIRON_PRODUCTION) {
  program_type = "Production";
} else if (WORK_ENV === ENVIRON_DEVELOP) {
  program_type = "Development";
} else {
  const error_mess = "global_consts.WORK_ENV does not equal Env_prd or  Env_dvl";
  printError(error_mess, 'web/src/components/Sidebar/', WORK_ENV);
}


export const Sidebar: React.FC = () => {
  return <SidebarContainer>
    Environment {program_type}

  </SidebarContainer>;
};