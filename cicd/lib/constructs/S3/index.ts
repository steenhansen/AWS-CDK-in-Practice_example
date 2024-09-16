/*

Container] 2024/09/15 23:48:45.366236 Running command cd ../cicd
[Container] 2024/09/15 23:48:45.372830 Running command yarn cdk deploy
yarn run v1.22.22
$ cdk deploy
/codebuild/output/src970661821/src/cicd/lib/constructs/S3/index.ts:6
const ENVIRON_PRODUCTION = config.ENVIRON_PRODUCTION;
                           ^
ReferenceError: Cannot access 'program_config_json_1' before initialization
    at Object.<anonymous> (/codebuild/output/src970661821/src/cicd/lib/constructs/S3/index.ts:6:28)
    at Module._compile (node:internal/modules/cjs/loader:1358:14)
    at Module.m._compile (/codebuild/output/src970661821/src/cicd/node_modules/ts-node/src/index.ts:1618:23)
    at Module._extensions..js (node:internal/modules/cjs/loader:1416:10)
    at Object.require.extensions.<computed> [as .ts] (/codebuild/output/src970661821/src/cicd/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1208:32)
    at Function.Module._load (node:internal/modules/cjs/loader:1024:12)
    at Module.require (node:internal/modules/cjs/loader:1233:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (/codebuild/output/src970661821/src/cicd/lib/the_main_stack.ts:12:1)
Subprocess exited with error 1
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.


*/


////////////// ksdfj
//import cdk_config from '../../../cdk.json';
//const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;


const ENVIRON_PRODUCTION = "Env_prd";  //config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = "Env_dvl"; //config.ENVIRON_DEVELOP;

//////////////////////// ksdfj

import { printError } from '../../../utils/env-errors';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { resolve } from 'path';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

import { Route53 } from '../Route53';
import { ACM } from '../ACM';


import config from '../../../program.config.json';
const S3_UNIQUE_ID = config.S3_UNIQUE_ID;
interface Props {
  acm: ACM;
  route53: Route53;
}

import { envLabel, lowerStatefulEnvLabel } from '../../../utils/construct_labels';




export class S3 extends Construct {
  public readonly web_bucket: Bucket;

  public readonly web_bucket_deployment: BucketDeployment;

  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);


    const bucket_name = envLabel('WebBucket');

    const bucketNameLow = lowerStatefulEnvLabel(S3_UNIQUE_ID);

    this.web_bucket = new Bucket(
      scope,
      bucket_name, //`WebBucket-${WORK_ENV}`,
      {
        bucketName: bucketNameLow,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html',
        publicReadAccess: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      },
    );

    const web_build_dir = resolve(__dirname, '..', '..', '..', '..', 'web', 'build');
    const web_bucket_deploy_name_n = envLabel('WebBucketDeployment');
    this.web_bucket_deployment = new BucketDeployment(
      scope,
      web_bucket_deploy_name_n,
      {
        sources: [Source.asset(web_build_dir)],
        destinationBucket: this.web_bucket
      }
    );

    let WORK_ENV2 = 'Env_prd';
    let frontEndSubDomain;
    if (WORK_ENV2 === ENVIRON_PRODUCTION) {
      frontEndSubDomain = config.DOMAIN_PROD_SUB_FRONTEND;
    } else if (WORK_ENV2 === ENVIRON_DEVELOP) {
      frontEndSubDomain = config.DOMAIN_DEV_SUB_FRONTEND;
    } else {
      printError("WORK_ENV <> 'Env_prd' nor 'Env_dvl' ", 'cdk/lib/constructs/S3/', `NODE_ENV="${WORK_ENV2}"`);
    }



    const distribution_name_n = envLabel('Frontend-Distribution');
    this.distribution = new Distribution(
      scope, distribution_name_n,
      {
        certificate: props.acm.certificate,
        domainNames: [`${frontEndSubDomain}.${config.DOMAIN_NAME}`],
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new S3StaticWebsiteOrigin(this.web_bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    const aRecord_name_n = envLabel('FrontendAliasRecord');
    new ARecord(scope,
      aRecord_name_n,
      {
        zone: props.route53.hosted_zone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
        recordName: `${frontEndSubDomain}.${config.DOMAIN_NAME}`,
      });


    const cfn_out_name = envLabel('FrontendURL');
    new CfnOutput(scope,
      cfn_out_name,
      {
        value: this.web_bucket.bucketDomainName,
      });
  }
}
