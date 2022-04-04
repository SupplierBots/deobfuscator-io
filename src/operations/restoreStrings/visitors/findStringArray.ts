import { NodePath, Visitor } from '@babel/traverse';
import { ArrayExpression } from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

export const FIND_STRING_ARRAY: Visitor<ObfuscatedStringsState> = {
  ArrayExpression: function (
    path: NodePath<ArrayExpression>,
    state: ObfuscatedStringsState,
  ) {
    const container = path.getStatementParent()?.parentPath;

    if (!container?.isProgram() || state.stringArrayValues) return;
    const elements = path.get(PathListKey.Elements);
    if (elements.some((e) => !e.isStringLiteral())) return;

    const parent = path.parentPath;
    if (!parent.isVariableDeclarator()) return;

    const id = parent.get(PathKey.Id);
    if (!id.isIdentifier()) return;

    state.stringArrayBinding = path.findBinding(id.node.name);
    state.stringArrayIdentifier = id;
    state.stringArrayValues = elements.map((e) => {
      if (!e.isStringLiteral()) return '';
      return e.node.value;
    });
  },
};
