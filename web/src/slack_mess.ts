



//  curl - X POST - H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/AAAAAAAAAAA/BBBBBBBBBBB/CCCCCCCCCCCCCCCCCCCCCCCC

import { C_cicd_web_SLACK_WEB_HOOK_ALIVE, C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK } from '../program.pipeline_2_web.json';


export function directSlackMess(direct_message: string) {
  try {
    if (C_cicd_web_SLACK_WEB_HOOK_ALIVE === 'yes') {
      const slack_payload = {
        attachments: [{ text: direct_message }]
      };
      const options = {
        method: 'post',
        baseURL: C_cicd_web_SECRET_PIPELINE_SLACK_WEBHOOK,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: slack_payload
      };

    }
  } catch (error) {
    console.error(error);
  }
}

