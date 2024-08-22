import React from 'react';

import { SidebarContainer } from './styles';

export const Sidebar: React.FC = () => {
  return <SidebarContainer>
    <b>AWS Serverless Typescript Example</b>
    <ul>
      <li>Test offline locally</li>
      <li>Lambdas with layers</li>
      <li>CI/CD pipeline</li>
      <li>Slack AWS Chatbot</li>
    </ul>
    <br></br>
    <b>Uses</b>
    <ul>
      <li>NoSql Workbench for local DynamoDB</li>
      <li>Docker Desktop to CDK build</li>
    </ul>
  </SidebarContainer>;
};