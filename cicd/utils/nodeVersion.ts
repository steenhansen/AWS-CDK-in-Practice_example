
import { Runtime } from 'aws-cdk-lib/aws-lambda';


export function nodeRuntime(node_integer: number): Runtime {
  const node_expected = 'nodejs' + node_integer + ".x";
  const node_runtime = new Runtime(node_expected, 0, { supportsInlineCode: true });
  return node_runtime;
}


