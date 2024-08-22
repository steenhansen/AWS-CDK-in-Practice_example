/* ---------- External libraries ---------- */
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { IBaseService } from 'aws-cdk-lib/aws-ecs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/* ---------- Constructs ---------- */
import { PipelineStack } from './constructs/Pipeline/index';

import { namedPipelineLabel, namedPipelineEnvLabel } from '../construct_labels';
const namedPipeline_label = namedPipelineLabel();
const namedPipelineProd_label = namedPipelineEnvLabel('Prod');
const namedPipelineDev_label = namedPipelineEnvLabel('Dev');

interface PipelineProps extends StackProps {
  bucket?: IBucket;
  repository?: IRepository;
  expressAppService?: IBaseService;
}

export class ThePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    new PipelineStack(this, namedPipelineProd_label, {
      environment: 'Prod',
    });

    new PipelineStack(this, namedPipelineDev_label, {
      environment: 'Dev',
    });

    Tags.of(scope).add('Project', namedPipeline_label);
  }
}
