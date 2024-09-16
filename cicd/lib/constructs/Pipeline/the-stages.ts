

import { CodeBuildAction, GitHubSourceAction, GitHubTrigger } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { SecretValue } from 'aws-cdk-lib';
import { Role } from 'aws-cdk-lib/aws-iam';
import stack_config from '../../../program.config.json';
const GITHUB_REPO = stack_config.GITHUB_REPO;
const GITHUB_OWNER = stack_config.GITHUB_OWNER;
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';
export function sourceStage(outputSource: Artifact, secretToken: SecretValue, prod_or_dev_branch: string) {
  const source_stage = {
    stageName: 'Source',
    actions: [
      new GitHubSourceAction({
        actionName: 'Source',
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        branch: prod_or_dev_branch,
        oauthToken: secretToken,
        output: outputSource,
        trigger: GitHubTrigger.WEBHOOK,
      }),
    ],
  };
  return source_stage;
}


export function backEndStage(backend_test_proj: PipelineProject, outputSource: Artifact, cdk_role: Role) {
  const back_end_stage = {
    stageName: 'Back-End-Test',
    actions: [
      new CodeBuildAction({
        actionName: 'Back-End-Test',
        project: backend_test_proj,
        input: outputSource,
        outputs: undefined,
        role: cdk_role
      }),
    ],
  };
  return back_end_stage;
}




export function frontEndStage(frontend_test_proj: PipelineProject, outputSource: Artifact, cdk_role: Role) {
  const front_stage = {
    stageName: 'Front-End-Test',
    actions: [
      new CodeBuildAction({
        actionName: 'Front-End-Test',
        project: frontend_test_proj,
        input: outputSource,
        outputs: undefined,
        role: cdk_role
      }),
    ],
  };
  return front_stage;
}






export function deployStage(deploy_proj: PipelineProject, outputSource: Artifact, cdk_role: Role) {
  const deploy_stage = {
    stageName: 'Build-and-Deploy',
    actions: [
      new CodeBuildAction({
        actionName: 'Build-and-Deploy-Front-and-Back-End',
        project: deploy_proj,
        input: outputSource,
        outputs: undefined,
        role: cdk_role
      }),
    ],
  };
  return deploy_stage;
}