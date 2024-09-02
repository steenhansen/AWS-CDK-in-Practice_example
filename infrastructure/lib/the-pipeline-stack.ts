const label_prod_pipeline = "The-Pipeline.Prod";
const label_dev_pipeline = "The-Pipeline.Dev";
const label_project = "The-Project";


/* ---------- External libraries ---------- */
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { IBaseService } from 'aws-cdk-lib/aws-ecs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/* ---------- Constructs ---------- */
import { PipelineStack } from './constructs/Pipeline/index';


import { stackLabel } from '../utils/construct_labels';

import stack_config from '../program.config.json';


const STACK_NAME = stack_config.STACK_NAME;


interface PipelineProps extends StackProps {
  bucket?: IBucket;
  repository?: IRepository;
  expressAppService?: IBaseService;
}

export class ThePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    //process.env.NODE_ENV = 'Production';
    //const pipe_prod = 'Cha pter9-Pipeline-Prod';
    const pipe_prod = stackLabel(label_prod_pipeline);
    //console.log("XXXXXXXXXXXXXXXXXXX 94873333", pipe_prod, pipe_prod2);


    /* ---------- Constructs ---------- */
    //    new PipelineStack(this, 'Ch apter9-Pipeline-Prod', {
    new PipelineStack(this, pipe_prod, {
      environment: 'Production',
    });

    //process.env.NODE_ENV = 'Development';
    //const pipe_dev = 'Cha pter9-Pipeline-Dev';
    const pipe_dev = stackLabel(label_dev_pipeline);
    //console.log("XXXXXXXXXXXXXXXXXXX 85575755", pipe_dev, pipe_dev2);
    //    new PipelineStack(this, 'Chapt er9-Pipeline-Dev', {
    new PipelineStack(this, pipe_dev, {
      environment: 'Development',
    });
    //console.log("XXXXXXXXXXXXXXXXXXX done stacks");
    /* ---------- Tags ---------- */
    const the_project = stackLabel(label_project);
    //    Tags.of(scope).add('Project', 'Chapt er9-Pipeline');
    Tags.of(scope).add('Project', the_project);
  }
}


