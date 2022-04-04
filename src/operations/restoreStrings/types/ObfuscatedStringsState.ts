import { Binding, NodePath } from '@babel/traverse';
import {
  FunctionDeclaration,
  Identifier,
  VariableDeclaration,
} from '@babel/types';
import { StringsDecoder } from './StringsDecoder';
import { StringArrayGetter } from './StringArrayGetter';

export interface ObfuscatedStringsState {
  arrayDeclaration?: NodePath<VariableDeclaration | FunctionDeclaration>;
  arrayIdentifier?: NodePath<Identifier>;
  arrayBinding?: Binding;
  arrayValues?: string[];
  getters: { [key: string]: StringArrayGetter };
  decoder?: StringsDecoder;
}
