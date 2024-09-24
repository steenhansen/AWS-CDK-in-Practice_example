
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { NotificationRule } from 'aws-cdk-lib/aws-codestarnotifications';
import { PipelineStack } from './index';

import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;

import stack_config from '../../../program.config.json';
const C_cicd_web_ENVIRON_PRODUCTION = stack_config.C_cicd_web_ENVIRON_PRODUCTION;
const C_cicd_web_ENVIRON_DEVELOP = stack_config.C_cicd_web_ENVIRON_DEVELOP;

import { envLabel } from '../../../utils/construct_labels';
import stack_switches from '../../../program.switches.json';
const C_cicd_CHATBOT_ALIVE = stack_switches.C_cicd_CHATBOT_ALIVE;


export function chatBot(pipeline_scope: PipelineStack,
  CHATBOT_PROD_CHANNEL_ID: string,
  CHATBOT_DEV_CHANNEL_ID: string,
  CHATBOT_WORKSPACE_ID: string,
  slack_events: string[]) {
  if (C_cicd_CHATBOT_ALIVE === 'yes') {

    let channel_id = '';
    if (WORK_ENV === C_cicd_web_ENVIRON_PRODUCTION) {
      channel_id = CHATBOT_PROD_CHANNEL_ID;
    } else if (WORK_ENV === C_cicd_web_ENVIRON_DEVELOP) {
      channel_id = CHATBOT_DEV_CHANNEL_ID;
    }

    const slack_topic_name = envLabel('Pipeline-SlackNotificationsTopic');
    const pipeline_slack_config = envLabel('Pipeline-Slack-Channel-Config');
    const snsTopic = new Topic(pipeline_scope, slack_topic_name);
    const slackConfig = new SlackChannelConfiguration(pipeline_scope, 'SlackChannel', {
      slackChannelConfigurationName: pipeline_slack_config,
      slackWorkspaceId: CHATBOT_WORKSPACE_ID,
      slackChannelId: channel_id
    });
    const rule = new NotificationRule(pipeline_scope, 'SlackNotificationRule', {
      source: pipeline_scope.pipeline,
      events: slack_events,
      targets: [snsTopic],
    });
    rule.addTarget(slackConfig);

  }

}