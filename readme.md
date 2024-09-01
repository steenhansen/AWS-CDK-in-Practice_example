
http://elsn.state.yark-production.s3.amazonaws.com/index.html












https://front-prod.steenhansen.click/index.html
https://back-prod.steenhansen.click/




https://elsn.state.yark-production.s3-website-us-east-1.amazonaws.com/


GET
	https://dev-backend-steen-hansen.steenhansen.click/   where did this come from?

should be
https://back-prod.steenhansen.click/


////////////////







Outputs:
Chapter9Stack-Production.ApiGatewayProductionchapter9restapiEndpointCF15572A = https://aazh4mm8zl.execute-api.us-east-1.amazonaws.com/prod/
Chapter9Stack-Production.ApiGatewayProductiondynamoclearlambdaDynUrlClear08B159C7 = https://hnmaf7nlbg2nnjolrntfofst4a0vazvw.lambda-url.us-east-1.on.aws/
Chapter9Stack-Production.ApiGatewayProductiondynamogetlambdaDynUrlGetB3AD85D7 = https://qvh7hcxbz7de3lphu7cuag43gi0klndn.lambda-url.us-east-1.on.aws/
Chapter9Stack-Production.ApiGatewayProductiondynamopostlambdaDynUrlPost5C6CAE10 = https://onnxuk3wqmlwro6bwmx6nha7m40gcedq.lambda-url.us-east-1.on.aws/
Chapter9Stack-Production.FrontendURLProduction = elsn.state.yark-production.s3.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-east-1:211125473900:stack/Chapter9Stack-Production/c6b86a60-68a2-11ef-8c4a-0affc378b5f9



https://us-east-1.console.aws.amazon.com/s3/ap/create?region=us-east-1
s3 access point

elsn.state.yark-production.s3.amazonaws.com



Creating an optimized production build...
=============

WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.

You may find that it works just fine, or you may not.

SUPPORTED TYPESCRIPT VERSIONS: >=3.3.1 <5.2.0

YOUR TYPESCRIPT VERSION: 5.5.4

Please only submit bug reports when using the officially supported version.

=============







THIS WORKED for a local start up
yarn run cross-env REACT_APP__SLACK_HOOK=https://hooks.slack.com   yarn run local-web-start




yarn cross-env REACT_APP__SLACK_WEBHOOK=https://hooks.slack.com   yarn local-web-start

check with other stuff....










developement
  cd server
    yarn server-build
    yarn cross-env SERVER__SLACK_HOOK=https://hooks.slack.com   yarn server-start


  cd web
    yarn build:prod
    yarn cross-env REACT_APP__SLACK_HOOK=https://hooks.slack.com       yarn local-web-start






server
  yarn server-build
  yarn server-start

web
  yarn build:prod
  yarn local-web-start

infrastructure
  yarn infra-build
  yarn cdk synth --profile lambda-user
  yarn cdk diff


  yarn cdk bootstrap --profile lambda-user

  yarn cdk deploy --profile lambda-user

  yarn cdk destroy --profile lambda-user

  yarn cdk:pipeline deploy --profile lambda-user




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
