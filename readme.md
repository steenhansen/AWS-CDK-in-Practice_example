

TSError: ⨯ Unable to compile TypeScript:
lib/constructs/Pipeline/index.ts(328,25): error TS2304: Cannot find name 'SLACK_PROD_CHANNEL_ID'.







   if (CICD_SLACK_ALIVE === 'yes') {


 const label_back_test = `BackTest-PipeProj-${props.environment}`;     // Prod or Dev









https://colordb-state-kill-devil-prod.s3.us-east-1.amazonaws.com/index.html





Outputs:
ColorDb-Run-Stack-Prod.FrontendURLEnvprd = colordb-state-kill-devil-prod.s3.amazonaws.com
ColorDb-Run-Stack-Prod.ProgAPIGwProdColorDbPipeRestApiEndpoint948F2E84 = https://oxgk24ol1k.execute-api.us-east-1.amazonaws.com/Prod/
ColorDb-Run-Stack-Prod.ProgAPIGwProddynamoclearlambdaUrlClear069A7264 = https://zejeudsacdysehbe45qp7rhqdi0ownkt.lambda-url.us-east-1.on.aws/
ColorDb-Run-Stack-Prod.ProgAPIGwProddynamogetlambdaUrlGetE74210E5 = https://6wo5zz5isitf7ck4cepewzcw2e0ozncr.lambda-url.us-east-1.on.aws/
ColorDb-Run-Stack-Prod.ProgAPIGwProddynamopostlambdaUrlPost8CC84A64 = https://ktyfhjty5o5ltgsmktv2eajjnu0ilxyp.lambda-url.us-east-1.on.aws/
Stack ARN:
arn:aws:cloudformation:us-east-1:211125473900:stack/ColorDb-Run-Stack-Prod/a7aa90c0-6b00-11ef-9213-12b693db753d

TO GET DB working:
  s3
  https://elsn-state-kill-devil-prod.s3.us-east-1.amazonaws.com/index.html    works uptodate



//////////////////////////


make color-box
say slack message if there is a 42 in a color







Local Developement
  cd server
    yarn server-build
    yarn cross-env   SERVER__SLACK_HOOK=https://hooks.slack.com   yarn server-start

  
  cd web             
    yarn web-build-prod
    yarn cross-env   REACT_APP__SLACK_HOOK=https://hooks.slack.com   yarn web-start





Deploy to AWS
  cd infrastructure
    yarn cdk-build

    Dev
      yarn cdk-dev bootstrap --profile lambda-user
      yarn cdk-dev synth     --profile lambda-user           > ../../cdk_synth_dev.yaml
      yarn cdk-dev diff
      yarn cdk-dev deploy    --profile lambda-user
      yarn cdk-dev destroy   --profile lambda-user
        https://front-dev.steenhansen.click/index.html

    Prod
      yarn cdk-prod bootstrap --profile lambda-user
      yarn cdk-prod synth     --profile lambda-user           > ../../cdk_synth_prod.yaml
      yarn cdk-prod diff
      yarn cdk-prod deploy    --profile lambda-user
      yarn cdk-prod destroy   --profile lambda-user
        https://front-prod.steenhansen.click/index.html

    Deploy
      yarn cdk-pipeline synth --profile lambda-user      > ../../pipeline_synth.yaml
      yarn cdk-pipeline deploy --profile lambda-user
      yarn cdk-pipeline destroy --profile lambda-user





then copy over c9 to aws-..example
then commit on github


https://frontend-cdk-book.steenhansen.click/index.html




https://us-east-1.console.aws.amazon.com/s3/object/chapter-9-web-bucket-akemxdjqkl-production?region=us-east-1&bucketType=general&prefix=index.html


https://chapter-9-web-bucket-akemxdjqkl-production.s3.amazonaws.com/index.html




frontend-cdk-book.steenhansen.click
A
Simple
Yes
d25g6iwc9y940q.cloudfront.net.





////////////////////////////////////
https://us-east-1.console.aws.amazon.com/s3/buckets/chapter-9-web-bucket-akemxdjqkl-production?region=us-east-1&bucketType=general&tab=objects

URL:       https://chapter-9-web-bucket-akemxdjqkl-production.s3.amazonaws.com/index.html

Cloud Front:
  Origins:
    chapter-9-web-bucket-akemxdjqkl-production.s3-website-us-east-1.amazonaws.com
