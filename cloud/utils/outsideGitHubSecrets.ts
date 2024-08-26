var fs = require('fs');
import stack_config from '../cloud.config.json';
const AWS_REGION = stack_config.AWS_REGION;
const AWS_SECRET_NAME = stack_config.AWS_SECRET_NAME;
const SECRETS_FILENAME = stack_config.SECRETS_FILENAME;

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

interface OutsideSecrets {
  SECRET_GITHUB_TOKEN: string;
  SECRET_GITHUB_NAME: string;
  SECRET_PROD_CHANNEL: string;
  SECRET_DEV_CHANNEL: string;
  SECRET_WORKSPACE_ID: string;
  SECRET_SLACK_WEBHOOK: string;
}

const aws_cdk_in_practice_secrets = '../../' + SECRETS_FILENAME;

export function getSecrets(): any {
  if (fs.existsSync(aws_cdk_in_practice_secrets)) {
    const local_secrets_str = fs.readFileSync(aws_cdk_in_practice_secrets);
    const local_secrets_object: OutsideSecrets = JSON.parse(local_secrets_str);
    return local_secrets_object;
  } else {
    console.log("I AM HERE aaaaaaaaaaaaaaaaa");
    let aws_secrets_str: any;
    let aws_secrets_object = {};
    (async () => {
      const client = new SecretsManagerClient({
        region: AWS_REGION
      });
      let response;
      try {
        response = await client.send(
          new GetSecretValueCommand({
            SecretId: AWS_SECRET_NAME,
            VersionStage: "AWSCURRENT"
          })
        );
      } catch (error) {
        console.log("errored out ", error);
        throw error;
      }
      aws_secrets_str = response.SecretString!;
      console.log("I AM HERE aws_secrets_str", aws_secrets_str);
      aws_secrets_object = JSON.parse(aws_secrets_str);

    })();
    return aws_secrets_object;
  }

}


