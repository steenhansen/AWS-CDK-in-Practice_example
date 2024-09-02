import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { S3 } from './constructs/S3';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';
import { ApiGateway } from './constructs/API-GW';
import { DynamoDB } from './constructs/DynamoDB';
import { AWSGlue } from './constructs/Glue';

import { envLabel } from '../utils/construct_labels';

export class TheMainStack extends Stack {
  public readonly acm: ACM;

  public readonly route53: Route53;

  public readonly s3: S3;

  public readonly vpc: Vpc;

  public readonly dynamo: DynamoDB;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const isCDKLocal = process.env.NODE_ENV === 'CDKLocal';

    const the_dyna = `Dynamo-${process.env.NODE_ENV || ''}`;
    const the_dyna2 = envLabel('The-Dynamo');                 //// ????????????????? used multiple places
    console.log("dynamoUUUUUUU", the_dyna, the_dyna2);


    this.dynamo = new DynamoDB(this, `Dynamo-${process.env.NODE_ENV || ''}`);

    if (isCDKLocal) return;


    const the_glue = `Glue-${process.env.NODE_ENV || ''}`;
    const the_glue2 = envLabel('The-Glue');
    console.log("glueUUUUUUUUUUUU", the_glue, the_glue2);


    new AWSGlue(this, `Glue-${process.env.NODE_ENV || ''}`, {
      table: this.dynamo.table,
    });

    const the_route = `Route53-${process.env.NODE_ENV || ''}`;
    const the_route2 = envLabel('Route-53');
    console.log("routeUUUUUUUUUUUUUUU", the_route, the_route2);


    this.route53 = new Route53(this, `Route53-${process.env.NODE_ENV || ''}`);



    const the_acm = `ACM-${process.env.NODE_ENV || ''}`;
    const the_acm2 = envLabel('The-ACM');
    console.log("ACMUUUUUUUUUUUUUUUU", the_acm, the_acm2);

    this.acm = new ACM(this, `ACM-${process.env.NODE_ENV || ''}`, {
      hosted_zone: this.route53.hosted_zone,
    });


    const the_s3 = `S3-${process.env.NODE_ENV || ''}`;
    const the_s32 = envLabel('The-S3');
    console.log("S3 UUUUUUUUUUu", the_s3, the_s32);

    this.s3 = new S3(this, `S3-${process.env.NODE_ENV || ''}`, {
      acm: this.acm,
      route53: this.route53,
    });

    const the_api = `Api-Gateway-${process.env.NODE_ENV || ''}`;
    const the_api2 = envLabel('Prog-API-Gw');
    console.log("apiS3 UUUUUUUUUUu", the_api, the_api2);


    new ApiGateway(this, `Api-Gateway-${process.env.NODE_ENV || ''}`, {
      //new ApiGateway(this, `ApiG-${process.env.NODE_ENV || ''}`, {
      route53: this.route53,
      acm: this.acm,
      dynamoTable: this.dynamo.table,
    });
  }
}
