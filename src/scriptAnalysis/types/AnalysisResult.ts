import { NodePath } from '@babel/traverse';
import { Identifier } from '@babel/types';
import { StringArrayFunction } from './StringArrayFunction';

export interface AnalysisResult {
  stringArrayIdentifier?: NodePath<Identifier>;
  stringArrayValues?: string[];
  arrayFunctions: StringArrayFunction[];
}
