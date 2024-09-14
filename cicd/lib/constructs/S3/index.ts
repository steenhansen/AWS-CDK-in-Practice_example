
////////////// ksdfj
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;



//////////////////////// ksdfj

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


import { lowerStatefulEnvLabel } from '../../../utils/construct_labels';




export class S3 extends Construct {
  public readonly web_bucket: Bucket;

  public readonly web_bucket_deployment: BucketDeployment;

  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);




    const bucketNameLow = lowerStatefulEnvLabel(S3_UNIQUE_ID);

    this.web_bucket = new Bucket(
      scope,
      `WebBucket-${WORK_ENV}`,
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

    this.web_bucket_deployment = new BucketDeployment(
      scope,
      `WebBucketDeployment-${WORK_ENV}`,
      {
        sources: [Source.asset(web_build_dir)],
        destinationBucket: this.web_bucket
      }
    );

    const frontEndSubDomain =
      WORK_ENV === 'Env_prd'
        ? config.DOMAIN_PROD_SUB_FRONTEND
        : config.DOMAIN_DEV_SUB_FRONTEND;



    this.distribution = new Distribution(
      scope,
      `Frontend-Distribution-${WORK_ENV}`,
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

    new ARecord(scope, `FrontendAliasRecord-${WORK_ENV}`, {
      zone: props.route53.hosted_zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
      recordName: `${frontEndSubDomain}.${config.DOMAIN_NAME}`,
    });

    new CfnOutput(scope, `FrontendURL-${WORK_ENV}`, {
      value: this.web_bucket.bucketDomainName,
    });
  }
}
