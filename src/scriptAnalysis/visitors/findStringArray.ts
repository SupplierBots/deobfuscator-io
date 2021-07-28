import { NodePath, Visitor } from '@babel/traverse';
import { ArrayExpression } from '@babel/types';
import { AnalysisResult } from '../types/AnalysisResult';

export const FIND_STRING_ARRAY: Visitor<AnalysisResult> = {
  ArrayExpression: function (
    path: NodePath<ArrayExpression>,
    state: AnalysisResult,
  ) {
    const container = path.getStatementParent()?.parentPath;

    if (!container?.isProgram() || state.stringArrayValues) return;
    const elements = path.get('elements');
    if (elements.some((e) => !e.isStringLiteral())) return;

    const parent = path.parentPath;
    if (!parent.isVariableDeclarator()) return;

    const id = parent.get('id');
    if (!id.isIdentifier()) return;

    state.stringArrayIdentifier = id;
    state.stringArrayValues = elements.map((e) => {
      if (!e.isStringLiteral()) return '';
      return e.node.value;
    });
  },
};
