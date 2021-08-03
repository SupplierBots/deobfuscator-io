import { NodePath, Visitor } from '@babel/traverse';
import { StringLiteral } from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

export const UNESCAPE_UNICODE_SEQUENCES: Visitor<ObfuscatedStringsState> = {
  StringLiteral: function (path: NodePath<StringLiteral>) {
    delete path.node.extra;
  },
};
