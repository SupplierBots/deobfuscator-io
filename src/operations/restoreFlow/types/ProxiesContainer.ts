import { MemberExpression } from '@babel/types';
import { BinaryProxy } from './BinaryProxy';
import { CallProxy } from './CallProxy';

export interface ProxiesContainer {
  name: string;
  keys: string[];
  scopeUid: number;
  stringLiterals: { [key: string]: string };
  binaryProxies: { [key: string]: BinaryProxy };
  callProxies: { [key: string]: CallProxy };
  memberExpressionProxies: { [key: string]: MemberExpression };
  fakeReferences: number;
  referencesCount: number;
  foundReferences: number;
}
