import { BinaryProxy } from './BinaryProxy';
import { CallProxy } from './CallProxy';

export interface ProxiesContainer {
  name: string;
  stringLiterals: { [key: string]: string };
  binaryProxies: { [key: string]: BinaryProxy };
  callProxies: { [key: string]: CallProxy };
  foundReferences: number;
}
