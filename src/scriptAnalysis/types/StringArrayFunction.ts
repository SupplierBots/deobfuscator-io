import { NodePath } from '@babel/traverse';
import { FunctionDeclaration, Identifier } from '@babel/types';
import { ArrayEncryption } from './ArrayEncryption';

export interface StringArrayFunction {
  encryption: ArrayEncryption;
  path: NodePath<FunctionDeclaration>;
  identifier: NodePath<Identifier>;
  offset: number;
}
