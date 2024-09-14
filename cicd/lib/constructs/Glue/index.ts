
////////////// ksdfj
import cdk_config from '../../../cdk.json';
const WORK_ENV = cdk_config.context.global_consts.WORK_ENV;
const THE_ENVIRONMENTS: any = cdk_config.context.environment_consts;



//////////////////////// ksdfj


/* ---------- External Libraries ---------- */
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  CfnJob as GlueJob,
  CfnCrawler as GlueCrawler,
} from 'aws-cdk-lib/aws-glue';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { resolve } from 'path';

interface IGlue {
  table: Table;
}

const label_glue_dynamo = "Glue-DynamoDBRole";
const label_glue_role = "glue-service-role";

import { envLabel, lowerEnvLabel } from '../../../utils/construct_labels';



export class AWSGlue extends Construct {
  public readonly glue_dynamo_role: Role;

  public readonly glue_crawler: GlueCrawler;

  public readonly glue_s3_crawler: GlueCrawler;

  public readonly glue_export_job: GlueJob;

  constructor(scope: Construct, id: string, props: IGlue) {
    super(scope, id);

    const { table } = props;

    const sourceBucket = new Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });


    const glue_role = envLabel(label_glue_dynamo);
    const glue_name = lowerEnvLabel(label_glue_role);
    // Roles:
    this.glue_dynamo_role = new Role(
      scope,
      glue_role,
      {
        assumedBy: new ServicePrincipal('glue.amazonaws.com'),
        roleName: glue_name,
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSGlueServiceRole',
          ),
          ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ],
      },
    );

    this.glue_dynamo_role.addToPolicy(
      new PolicyStatement({
        actions: ['dynamodb:*', 's3:*'],
        resources: ['*'],
      }),
    );

    // Script:
    const SCRIPTS_LOCATION = [__dirname, '.', 'scripts'];

    new BucketDeployment(this, 'GlueScript', {
      destinationBucket: sourceBucket,
      sources: [Source.asset(resolve(...SCRIPTS_LOCATION, 'dynamo-to-s3.zip'))],
      destinationKeyPrefix: 'scripts',
      prune: false,
      memoryLimit: 256,
    }); // upload the script into s3

    // Crawlers:
    this.glue_crawler = new GlueCrawler(
      scope,
      `Glue-Dynamo-Crawler-${WORK_ENV}`,
      {
        role: this.glue_dynamo_role.roleArn,
        targets: {
          dynamoDbTargets: [{ path: table.tableName }],
        },
        databaseName: `maintable-gluedb-${WORK_ENV?.toLowerCase()}`,
        name: `dynanamo-crawler-${WORK_ENV?.toLowerCase()}`,
      },
    );

    this.glue_s3_crawler = new GlueCrawler(
      scope,
      `Glue-S3-Crawler-${WORK_ENV}`,
      {
        role: this.glue_dynamo_role.roleArn,
        targets: {
          dynamoDbTargets: [{ path: table.tableName }],
          s3Targets: [{ path: `s3://${sourceBucket.bucketName}/glue/` }],
        },
        databaseName: `maintable-gluedb-${WORK_ENV?.toLowerCase()}`,
        name: `s3-crawler-${WORK_ENV?.toLowerCase()}`,
      },
    );

    // Jobs:
    this.glue_export_job = new GlueJob(
      this,
      `Glue-DynamoDBExport-Job-${WORK_ENV}`,
      {
        role: this.glue_dynamo_role.roleArn,
        command: {
          name: 'glueetl',
          scriptLocation: `s3://${sourceBucket.bucketName}/scripts/dynamo-to-s3.py`,
          pythonVersion: '3',
        },
        name: `export-dynamodb-to-s3-glue-job-${WORK_ENV?.toLowerCase()}`,
        glueVersion: '4.0',
        defaultArguments: {
          '--GLUE_DATABASE_NAME': this.glue_crawler.databaseName,
          '--GLUE_TABLE_NAME': table.tableName,
          '--TARGET_S3_BUCKET': `s3://${sourceBucket.bucketName}/glue/`,
          '--JOB_NAME': `export-dynamodb-to-s3-glue-job-${WORK_ENV?.toLowerCase()}`,
        },
      },
    );
  }
}
