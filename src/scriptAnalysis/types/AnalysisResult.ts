import { NodePath } from '@babel/traverse';
import { Identifier } from '@babel/types';
import { StringsDecoder } from '../StringsDecoder';
import { StringArrayFunction } from './StringArrayFunction';

export interface AnalysisResult {
  stringArrayIdentifier?: NodePath<Identifier>;
  stringArrayValues?: string[];
  arrayFunctions: { [key: string]: StringArrayFunction };
  decoder?: StringsDecoder;
}
