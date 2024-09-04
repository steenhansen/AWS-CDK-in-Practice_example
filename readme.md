
      this, "PostDynamoLayer", {                       // constant


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
