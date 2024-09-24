
Slack Webhooks
  https://api.slack.com/apps
  https://api.slack.com/apps/A07GEPEG6DS
  https://api.slack.com/apps/A07GEPEG6DS/incoming-webhooks

Pipeline Chatbot
  Slack Chatbot
    https://app.slack.com/apps-manage/T07BA5K4ZAB/integrations/installed

  AWS Chatbot Topics
    https://us-west-2.console.aws.amazon.com/sns/v3/home?region=us-east-1#/topics
      Pipeline-Slack-Channel-Config-Prod
      Pipeline-Slack-Channel-Config-Dev

  AWS Slack
    https://us-east-2.console.aws.amazon.com/chatbot/home?region=us-east-1#/chat-clients



////////////////////


    https://front-dev.steenhansen.click/index.html
    https://front-prod.steenhansen.click/index.html


Build Program
    yarn cicd-build
    yarn server-build       // depends on cicd
    yarn web-build          // depends on cicd

Local Developement
    yarn cicd-build
    yarn server-build
    yarn server-start
    START NoSQL Workbench for Amazon DynamoDB
    yarn web-build
    yarn cross-env  REACT_APP__SPEC_COLOR=Orange  REACT_APP__SPEC_NUM=199  yarn web-start

Local Tests
    yarn cicd-build
    yarn cicd-test
    yarn server-build
    yarn server-test
    yarn server-start
    yarn web-build
    yarn web-test

Install & Change GitHub Pipeline
    yarn cicd-build
    START docker desktop
    yarn cicd-pipeline bootstrap
    yarn cicd-pipeline synth                     > ../../pipeline_synth.yaml
        yarn cicd-pipeline diff                  > ../../pipeline_diff.yaml
    yarn cicd-pipeline deploy  
    yarn cicd-pipeline destroy 

Non-GitHub Deploy Program to AWS
      yarn cicd-build
      START docker desktop
      yarn server-build
      yarn web-build
      yarn cicd-prog bootstrap
      yarn cicd-prog synth                        > ../../deploy_synth.yaml  
          yarn cicd-prog diff                     > ../../deploy_diff.yaml
      yarn cicd-prog deploy  
      yarn cicd-prog destroy   