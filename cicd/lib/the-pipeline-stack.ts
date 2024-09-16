

import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { IBaseService } from 'aws-cdk-lib/aws-ecs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { PipelineStack } from './constructs/Pipeline/index';


import { stackLabel } from '../utils/construct_labels';



interface PipelineProps extends StackProps {
  bucket?: IBucket;
  repository?: IRepository;
  expressAppService?: IBaseService;
}

export class ThePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);


    const label_prod_pipeline = "The-Pipeline-Prod";
    //const label_dev_pipeline = "The-Pipeline-Dev";//
    const label_project = "The-Project";

    const pipe_prod = stackLabel(label_prod_pipeline);
    new PipelineStack(this, pipe_prod, {});
    //  environment: 'Prod',
    //});

    // const pipe_dev = stackLabel(label_dev_pipeline);  NO SUCH THING
    // new PipelineStack(this, pipe_dev, {
    //   environment: 'Dev',
    // });

    const the_project = stackLabel(label_project);
    Tags.of(scope).add('Project', the_project);
  }
}


