import axios from 'axios';

//  curl - X POST - H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/AAAAAAAAAAA/BBBBBBBBBBB/CCCCCCCCCCCCCCCCCCCCCCCC


import browser_config from './browser.config.json';

const SLACK_WEB_HOOK_ALIVE = browser_config.SLACK_WEB_HOOK_ALIVE;

export function directSlackMess(direct_message: string) {
  try {
    if (SLACK_WEB_HOOK_ALIVE === 'yes') {
      //const SLACK_WEBHOOK_Cred = browser_config.SLACK_WEBHOOK_Cred;
      const slack_payload = {
        attachments: [{ text: direct_message }]
      };
      const options = {
        method: 'post',
        baseURL: "https://www.google.com",    //SLACK_WEBHOOK_Cred,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: slack_payload
      };
      axios.request(options);
    }
  } catch (error) {
    console.error(error);
  }
}

