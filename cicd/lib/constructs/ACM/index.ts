import { Certificate, CertificateValidation, } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';


import stack_config from '../../../program.config.json';
const C_cicd_web_DOMAIN_NAME = stack_config.C_cicd_web_DOMAIN_NAME;


interface ACMProps {
  hosted_zone: IHostedZone;
}

export class ACM extends Construct {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: ACMProps) {
    super(scope, id);

    this.certificate = new Certificate(scope, 'Certificate', {
      domainName: C_cicd_web_DOMAIN_NAME,
      validation: CertificateValidation.fromDns(props.hosted_zone),
      subjectAlternativeNames: [`*.${C_cicd_web_DOMAIN_NAME}`],
    });
  }
}
