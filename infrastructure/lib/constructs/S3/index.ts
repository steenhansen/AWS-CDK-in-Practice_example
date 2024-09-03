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
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

import { Route53 } from '../Route53';
import { ACM } from '../ACM';

import the_constants from '../../../program.constants.json';
const STATEFUL_ID = the_constants.STATEFUL_ID;

import config from '../../../program.config.json';
const S3_UNIQUE_ID = config.S3_UNIQUE_ID;
const STACK_NAME = config.STACK_NAME;
interface Props {
  acm: ACM;
  route53: Route53;
}
import { lowerStatefulEnvLabel, lowerEnvLabel } from '../../../utils/construct_labels';

export class S3 extends Construct {
  public readonly web_bucket: Bucket;

  public readonly web_bucket_deployment: BucketDeployment;

  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const THE_ENV = process.env.NODE_ENV || '';
    //const bucketNameUp = `${STACK_NAME}.${STATEFUL_ID}.${S3_UNIQUE_ID}-${THE_ENV}`;
    //const bucketNameLow = (bucketNameUp).toLocaleLowerCase();



    const bucketNameLow = lowerStatefulEnvLabel(S3_UNIQUE_ID);
    //console.log("XXXXXXXXXXXXXXXXXXX 41395755", S3_UNIQUE_ID, bucketNameLow, bucketNameLow2);



    this.web_bucket = new Bucket(
      scope,
      `WebBucket-${process.env.NODE_ENV || ''}`,
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
      `WebBucketDeployment-${process.env.NODE_ENV || ''}`,
      {
        sources: [
          Source.asset(web_build_dir
            //   resolve(__dirname, '..', '..', '..', '..', 'web', 'build'),
          ),
        ],
        destinationBucket: this.web_bucket,
      },
    );

    const frontEndSubDomain =
      process.env.NODE_ENV_q_ === 'Env_prd'
        ? config.DOMAIN_SUB_FRONTEND
        : config.DOMAIN_SUB_FRONTEND_DEV;

    process.env.NODE_ENV === 'Production'
      ? config.DOMAIN_SUB_FRONTEND
      : config.DOMAIN_SUB_FRONTEND_DEV;

    this.distribution = new Distribution(
      scope,
      `Frontend-Distribution-${process.env.NODE_ENV || ''}`,
      {
        certificate: props.acm.certificate,
        domainNames: [`${frontEndSubDomain}.${config.DOMAIN_NAME}`],
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new S3Origin(this.web_bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    new ARecord(scope, `FrontendAliasRecord-${process.env.NODE_ENV || ''}`, {
      zone: props.route53.hosted_zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
      recordName: `${frontEndSubDomain}.${config.DOMAIN_NAME}`,
    });

    new CfnOutput(scope, `FrontendURL-${process.env.NODE_ENV || ''}`, {
      value: this.web_bucket.bucketDomainName,
    });
  }
}
