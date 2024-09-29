


# Minimal Direct Deploy to AWS


##  Changes Required
AWS account number must change from "999999999999" to a real account for both production and development.

    /cicd/cdk.json

      "ACCOUNT_NUMBER": "999999999999",

      "ACCOUNT_NUMBER": "999999999999",


Register a domain on [Route 53](https://us-east-1.console.aws.amazon.com/route53/domains/home?region=us-east-1#/DomainSearch) and replace "your-domain.click"

    /cicd/program.config.json

      "C_cicd_web_DOMAIN_NAME": "your-domain.click", 


## IAM User Permissions
  The AWS user's credentials entered below must have "AdministratorAccess" permission

## Initialize

```bash
$ aws configure
    AWS Access Key ID [None]: abcdefghijklmnopqrst 
    AWS Secret Access Key [None]: ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcd
    Default region name [None]: us-east-1
    Default output format [None]: json

$ cd cicd
$ yarn cicd-build
$ yarn cicd-to-cloud bootstrap 

$ cd server
$ yarn server-build

$ cd web
$ yarn web-build
```

## Settings

For a minimal non-pipeline AWS deployment, set all /cicd/program.switches.json to 'no'


    /cicd/program.switches.json

      "C_cicd_serv_web_REAL_TESTS_ALIVE": "no",
      "C_cicd_web_SPECIAL_ALIVE": "no",
      "C_cicd_CHATBOT_ALIVE": "no",
      "C_cicd_AUTO_INVALIDATE_CLOUDFRONT": "no"

## Deploy to AWS
Synth and diff commands can output to files
```bash
START Docker Desktop

$ yarn cicd-build
$ yarn server-build
$ yarn web-build

$ yarn cicd-to-cloud synth              > ../../deploy_synth.yaml  
$ yarn cicd-to-cloud deploy

$ yarn cicd-to-cloud destroy
$ yarn cicd-to-cloud diff               > ../../deploy_diff.yaml
```

Results of "yarn cicd-to-cloud deploy" below

Outputs:<br/>
ColorDb-Run-Stack-Dev.FrontendURLDev = [colordb-state-kill-devil-dev.s3.amazonaws.com](https://colordb-state-kill-devil-dev.s3.amazonaws.com/index.html)<br/>
ColorDb-Run-Stack-Dev.ProgAPIGwDevColorDbPipeRestApiEndpointC43CA8AA<br/>
ColorDb-Run-Stack-Dev.ProgAPIGwDevdynamoclearlambdaUrlClear3AB22FC1<br/>
ColorDb-Run-Stack-Dev.ProgAPIGwDevdynamogetlambdaUrlGet1CA036F0<br/>
ColorDb-Run-Stack-Dev.ProgAPIGwDevdynamopostlambdaUrlPostB974D998<br/>
Stack ARN:<br/>
arn:aws:cloudformation:us-east-1:211125473900:stack/ColorDb-Run-Stack-Dev/<br/>
✨  Total time: 151.32s<br/>
