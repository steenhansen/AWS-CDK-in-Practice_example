
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;


import config from '../../../program.config.json';

const ENVIRON_PRODUCTION = config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = config.ENVIRON_DEVELOP;

const AUTO_INVALIDATE_CLOUDFRONT = config.AUTO_INVALIDATE_CLOUDFRONT;


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

    const webB_name = envLabel('WebBucket');
    const bucketNameLow = lowerStatefulEnvLabel(S3_UNIQUE_ID);
    this.web_bucket = new Bucket(
      scope,
      webB_name,
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


    let frontEndSubDomain;
    if (WORK_ENV === ENVIRON_PRODUCTION) {
      frontEndSubDomain = config.DOMAIN_PROD_SUB_FRONTEND;
    } else if (WORK_ENV === ENVIRON_DEVELOP) {
      frontEndSubDomain = config.DOMAIN_DEV_SUB_FRONTEND;
    } else {
      printError("WORK_ENV <> 'Env_prd' nor 'Env_dvl' ", 'cdk/lib/constructs/S3/', `NODE_ENV="${WORK_ENV}"`);
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

    const web_build_dir = resolve(__dirname, '..', '..', '..', '..', 'web', 'build');
    const web_bucket_deploy_name_n = envLabel('WebBucketDeployment');
    let invalidate_cloudfront_path;
    if (AUTO_INVALIDATE_CLOUDFRONT === 'yes') {
      invalidate_cloudfront_path = '/*';
    } else {
      invalidate_cloudfront_path = '';
    }
    this.web_bucket_deployment = new BucketDeployment(
      scope,
      web_bucket_deploy_name_n,
      {
        sources: [Source.asset(web_build_dir)],
        destinationBucket: this.web_bucket,
        distribution: this.distribution,
        distributionPaths: [invalidate_cloudfront_path]
      }
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
