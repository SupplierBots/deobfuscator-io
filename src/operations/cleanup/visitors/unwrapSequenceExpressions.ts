import { NodePath, Visitor } from '@babel/traverse';
import { expressionStatement, SequenceExpression } from '@babel/types';

export const UNWRAP_SEQUENCE_EXPRESSIONS: Visitor = {
  SequenceExpression: function (path: NodePath<SequenceExpression>) {
    const parent = path.parentPath;
    if (!parent.isExpressionStatement()) return;
    const expressions = path.get('expressions');
    const statements = expressions.map((e) => expressionStatement(e.node));
    parent.replaceWithMultiple(statements);
  },
};
