import { Binding, NodePath } from '@babel/traverse';
import { Identifier } from '@babel/types';
import { StringsDecoder } from './StringsDecoder';
import { StringArrayFunction } from './StringArrayFunction';

export interface ObfuscatedStringsState {
  stringArrayIdentifier?: NodePath<Identifier>;
  stringArrayBinding?: Binding;
  stringArrayValues?: string[];
  arrayFunctions: { [key: string]: StringArrayFunction };
  decoder?: StringsDecoder;
}
