import { NodePath } from '@babel/traverse';
import {
  FunctionDeclaration,
  Identifier,
  VariableDeclaration,
} from '@babel/types';
import { ArrayEncryption } from './ArrayEncryption';

export interface StringArrayGetter {
  encryption: ArrayEncryption;
  declaration: NodePath<FunctionDeclaration | VariableDeclaration>;
  identifier: NodePath<Identifier>;
  offset: number;
}
