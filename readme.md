Chapter9Stack-Production.ApiGatewayProductionchapter9restapiEndpointCF15572A = https://gtvn8muonk.execute-api.us-east-1.amazonaws.com/prod/
Chapter9Stack-Production.FrontendURLProduction = chapter-9-web-bucket-akemxdjqkl-production.s3.amazonaws.com



server
  yarn server-build
  yarn server-start

web
  yarn build:prod
  yarn local-web-start

infrastructure
  yarn build
  yarn cdk deploy --profile lambda-user
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
