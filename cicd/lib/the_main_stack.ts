



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


    const the_dyna = envLabel('The-Dynamo');
    this.dynamo = new DynamoDB(this, the_dyna);



    const the_glue = envLabel('The-Glue');
    new AWSGlue(this, the_glue, {
      table: this.dynamo.table,
    });

    const the_route = envLabel('Route-53');
    this.route53 = new Route53(this, the_route);



    const the_acm = envLabel('The-ACM');
    this.acm = new ACM(this, the_acm, {
      hosted_zone: this.route53.hosted_zone,
    });



    const the_s3 = envLabel('The-S3');
    this.s3 = new S3(this, the_s3, {
      acm: this.acm,
      route53: this.route53,
    });

    const the_api = envLabel('Prog-API-Gw');
    new ApiGateway(this, the_api, {
      route53: this.route53,
      acm: this.acm,
      dynamoTable: this.dynamo.table,
    });


  }
}
