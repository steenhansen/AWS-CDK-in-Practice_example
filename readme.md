





slack config
https://app.slack.com/apps-manage/T07BA5K4ZAB/integrations/installed



THe two topics for slack
https://us-west-2.console.aws.amazon.com/sns/v3/home?region=us-west-2#/topics

////////////////////


make color-box
say slack message if there is a 42 in a color







Local Developement
  Server
    yarn server-build
    yarn cross-env   SERVER__SLACK_HOOK=https://hooks.slack.com   yarn server-start

  Web             
    yarn web-build
    yarn cross-env   REACT_APP__SLACK_HOOK=https://hooks.slack.com   yarn web-start


Local Tests
  Server
    yarn server-build
    yarn server-test 
  
  Web         
    yarn server-start       // in /server/ directory

    yarn web-build   
    yarn web-test

    yarn web-test -u         // update snapshots

  cicd
    yarn cicd-test
    yarn cicd-test -u     // update snapshots


Compile Program
      1 yarn cicd-build
      2 yarn server-build
      3 yarn web-build        // depends on cicd-build finishing
      

Deploy to AWS
    https://front-dev.steenhansen.click/index.html
    https://front-prod.steenhansen.click/index.html
      
      Compile Program

      yarn cicd bootstrap
      yarn cicd synth     > ../../deploy_synth.yaml  
      yarn cicd diff      > ../../deploy_diff.yaml
      yarn cicd deploy  
      yarn cicd destroy   



Install Pipeline
    Compile Program
    Push to GitHub

    yarn pipeline synth      > ../../pipeline_synth.yaml
    yarn pipeline diff       > ../../pipeline_diff.yaml
    yarn pipeline deploy  
    yarn pipeline destroy 




https://rehanvdm.com/blog/4-methods-to-configure-multiple-environments-in-the-aws-cdk


https://github.com/rehanvdm/cdk-multi-environment/blob/master/1-context/cdk.json


