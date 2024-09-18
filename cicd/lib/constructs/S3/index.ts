
import {
  CloudFrontClient, CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront';

//const { CloudFrontClient, CreateInvalidationCommand } = require("@aws-sdk/client-cloudfront");


import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;
const AWS_REGION = THE_ENVIRONMENTS[WORK_ENV].AWS_REGION;


import config from '../../../program.config.json';

const ENVIRON_PRODUCTION = config.ENVIRON_PRODUCTION;
const ENVIRON_DEVELOP = config.ENVIRON_DEVELOP;


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

  public readonly cfClient: CloudFrontClient;

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


    const web_build_dir = resolve(__dirname, '..', '..', '..', '..', 'web', 'build');


    const web_bucket_deploy_name_n = envLabel('WebBucketDeployment');
    this.web_bucket_deployment = new BucketDeployment(
      scope,
      web_bucket_deploy_name_n,
      {
        sources: [Source.asset(web_build_dir)],
        destinationBucket: this.web_bucket,
        distribution: this.distribution // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-s3-deployment-readme.html#cloudfront-invalidation
        // had to invalidate the cloudfront by hand so that https://front-prod.steenhansen.click was up to date
      }
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
    //  const cloud_front_target = new CloudFrontTarget(this.distribution);


    const aRecord_name_n = envLabel('FrontendAliasRecord');
    new ARecord(scope,
      aRecord_name_n,
      {
        zone: props.route53.hosted_zone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
        //    target: RecordTarget.fromAlias(cloud_front_target),
        recordName: `${frontEndSubDomain}.${config.DOMAIN_NAME}`,
      });

    const cfn_out_name = envLabel('FrontendURL');
    new CfnOutput(scope,
      cfn_out_name,
      {
        value: this.web_bucket.bucketDomainName,
      });



    //////////////////////
    ///https://github.com/aws/aws-sdk-js-v3/issues/2956
    // import {
    //   CloudFront, CreateInvalidationCommandInput,
    //   CreateInvalidationCommandOutput
    // } from '@aws-sdk/client-cloudfront';

    // const input: CreateInvalidationCommandInput = {
    //   DistributionId: cfn_out_name,
    //   InvalidationBatch: {
    //     CallerReference: buildHash,
    //     Paths: {
    //       Items: invalidationPaths,
    //       Quantity: invalidationPaths.length
    //     }
    //   }
    // };

    // const res: CreateInvalidationCommandOutput = await new CloudFront({ credentials: fromEnv() }).createInvalidation(input);
    // const invalidationId = res.Invalidation?.Id;


    //////////////////////
    //https://github.com/aws/aws-sdk-js-v3/issues/3207
    // import {
    //   CloudFrontClient, CreateInvalidationCommandInput,
    //   CreateInvalidationCommandOutput
    // } from '@aws-sdk/client-cloudfront';

    // this.cfClient = new CloudFrontClient({ region: AWS_REGION });

    // const params: CreateInvalidationCommandInput = {
    //   DistributionId: id,
    //   InvalidationBatch: {
    //     CallerReference: something,
    //     Paths: {
    //       Items: [path],
    //       Quantity: 1,
    //     },
    //   },
    // };

    // const invalidation: Invalidation = (await this.cfClient.send(new CreateInvalidationCommand(params))).Invalidation;

    ///////////////////
    //   
    ///   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudfront/command/CreateInvalidationCommand/
    ///


    // import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"; // ES Modules import
    // const { CloudFrontClient, CreateInvalidationCommand } = require("@aws-sdk/client-cloudfront"); // CommonJS import


    // const client = new CloudFrontClient(config);
    // const input = { // CreateInvalidationRequest
    //   DistributionId: distribution_name_n, // required
    //   InvalidationBatch: { // InvalidationBatch
    //     Paths: { // Paths
    //       Quantity: Number("int"), // required
    //       Items: [ // PathList
    //         "STRING_VALUE",
    //       ],
    //     },
    //     CallerReference: "STRING_VALUE", // required
    //   },
    // };
    // const command = new CreateInvalidationCommand(input);
    // const response = await client.send(command);


    // { // CreateInvalidationResult
    //   Location: "STRING_VALUE",
    //   Invalidation: { // Invalidation
    //     Id: "STRING_VALUE", // required
    //     Status: "STRING_VALUE", // required
    //     CreateTime: new Date("TIMESTAMP"), // required
    //     InvalidationBatch: { // InvalidationBatch
    //       Paths: { // Paths
    //         Quantity: Number("int"), // required
    //         Items: [ // PathList
    //           "STRING_VALUE",
    //         ],
    //       },
    //       CallerReference: "STRING_VALUE", // required
    //     },
    //   },
    // };




    /////////////////////
    //     https://github.com/aws/aws-sdk-js-v3/issues/5245
    //  https://stackoverflow.com/questions/67108190/how-to-invalidate-cloudfrontcahce-for-a-specific-folder-on-s3-in-nodejs
//    const cloudFront = new CloudFrontClient({});


 const cloudFront = new CloudFrontClient({});
    const invCom: any = new CreateInvalidationCommand({
      DistributionId: this.distribution.distributionId,
      InvalidationBatch: {
        CallerReference: `${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ['/*'],
        },
      },
    });
    cloudFront.send(invCom);

    /////////////

  }
}
