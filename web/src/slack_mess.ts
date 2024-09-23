export function directSlackMess(SSM_SLACK_WEBHOOK: string, slack_text_mess: string) {
  const slack_options = {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({ text: slack_text_mess })
  };
  (async () => {
    try {
      const slack_response = await fetch(SSM_SLACK_WEBHOOK, slack_options);
      console.log(slack_response);
    } catch (e: any) {
      console.error(SSM_SLACK_WEBHOOK, slack_text_mess, e);
    }
  })();
}

