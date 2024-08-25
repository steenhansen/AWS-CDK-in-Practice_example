



FROM 
    https://stackoverflow.com/questions/34134879/aws-the-config-profile-myname-could-not-be-found

"In my case, I had the variable named "AWS_PROFILE" on Environment variables with an old value."


$ aws sts get-caller-identity
$ The config profile (IAM-user-name) could not be found

    Environment variables
    AWS PROFILE: IAM-user-name
    aws_access_key_id : example
    aws_secret_access_key : example




To list all environment variables in PowerShell:
Get-ChildItem Env:


echo $Env:AWS_ACCESS_KEY_ID
    >> AKIAIOSFODNN7EXAMPLE






























# AWS-CDK-in-Practice 

This is a fork of [PacktPublishing/AWS-CDK-in-Practice](https://github.com/PacktPublishing/AWS-CDK-in-Practice) as a single derived example.

## Properties
  - Serverless CDK
  - Typescript
  - Test offline locally
  - Lambdas with layers
  - DynamoDB
  - CI/CD pipeline
  - Slack AWS Chatbot
  - Domain

## Supporting Software
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
  - [NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html) for local DynamoDB
  - Node 20.16.0


## Create Local DynamoDB Table
 Create 'dynamo_table-local' in NoSQL Workbench
 
![alt text](the-docs/the-images/dynamo_create.png)


## Run Debv Locally
        
    Start 
        Docker-Desktop
        NoSql Workshop, and turn on DDB local

    Compile AWS Cloud
        cd cloud
        yarn
        yarn build-aws       cloud-build
        yarn watch-aws       cloud-watch

    Compile Local Server
        cd lserver
        yarn
        yarn build-local    lserver-build
        yarn start-local    lserver-start

    Compile Local Browser
        cd lbrowser
        yarn
        yarn build-local   lbrowser-build-dev
        yarn start-local   lbrowser-start

    View 
        http://localhost:3004/







## Run Dev on AWS
        
    Start 
        Docker-Desktop

    Compile Local Browser
        cd lbrowser
        yarn build-dev           lbrowser-build-dev

    Compile Local Server
        cd lserver
        yarn
        yarn build-local    lserver-build
        yarn start-local    lserver-start

    Compile AWS Cloud
        cd cloud
        yarn build-aws             cloud-build
        yarn cdk-dev bootstrap --profile lambda-user
        yarn cdk-dev synth --profile lambda-user 
        yarn cdk-dev deploy --profile lambda-user
        yarn cdk-dev destroy --profile lambda-user

## Install Prod on AWS
        
    In program.config.json set
        "GITHUB_ALIVE": "yes",
        "GITHUB_secret_OAuthToken_Cred": "github_pat_ABC...",
        "GITHUB_REPO": "ur-github-repo",

    Start 
        Docker-Desktop

    Compile Local Browser
        cd lbrowser
        yarn build-prod                  lbrowser-build-prod

    Compile AWS Cloud
        cd cloud
        yarn build-aws                                  cloud-build
        yarn cdk-prod bootstrap --profile lambda-user


        yarn cdk-prod bootstrap -v --profile lambda-user

        yarn cdk-prod synth --profile lambda-user 
        yarn cdk-prod deploy --profile lambda-user

        
        
        yarn cdk-pipeline synth --profile lambda-user > ../../infra_synth2.yaml

        yarn cdk-pipeline deploy --profile lambda-user




## yarn cdk-dev deploy --profile lambda-user

The frontend endpoint : : [https://elsnbucket-jj180-dev.s3.amazonaws.com/index.html](https://elsnbucket-jj180-dev.s3.amazonaws.com/index.html)
![alt text](the-docs/the-images/deploy-to-aws.png)


## See difference between local and deployed stacks
    Start 
        Docker-Desktop

    yarn cdk-dev-changes diff --profile lambda-user
    yarn cdk-prod-changes diff --profile lambda-user



## Test Locally
        
    Start 
        Docker-Desktop

    Test AWS Cloud
        cd cloud
        yarn build-aws  
        
        yarn test         
        yarn test -u        // update snapshots

    Compile Local Server
        cd lserver
        yarn build-local
        yarn test

    Compile Local Browser
        cd lbrowser
        yarn build-local
        yarn test



## AWS screens

- [CloudFormation](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1) 

![alt text](the-docs/the-images/cloud-formation.png)



- [CloudFront](https://us-east-1.console.aws.amazon.com/cloudfront/v4/home?region=us-east-1#/distributions) : : [d2kwjwhuvreu0v.cloudfront.net](https://d2kwjwhuvreu0v.cloudfront.net)


![alt text](the-docs/the-images/cloudfront.png)




- [DynamoDB](https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=dynamo_table-dev)

![alt text](the-docs/the-images/aws-dynamo.png)

- [Group Permissions](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/users/details/lambda-user?section=permissions)

![alt text](the-docs/the-images/lambda-group.png)

- [Lambdas](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions)

![alt text](the-docs/the-images/lambdas.png)

- [S3 Buckets](https://us-east-1.console.aws.amazon.com/s3/home?region=us-east-1)

![alt text](the-docs/the-images/s3-buckets.png)

- [Route 53](https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones?region=us-east-1) : : [https://dev-frontend-steen-hansen.steenhansen.click/](https://dev-frontend-steen-hansen.steenhansen.click/)

![alt text](the-docs/the-images/route-53.png)

## Docker & NoSQL Workbench Screens
![alt text](the-docs/the-images/docker.png)

![alt text](the-docs/the-images/nosql-workbench.png)
