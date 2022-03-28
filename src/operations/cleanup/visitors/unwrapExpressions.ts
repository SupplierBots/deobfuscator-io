import { NodePath, Visitor } from '@babel/traverse';
import {
  blockStatement,
  expressionStatement,
  ifStatement,
  LogicalExpression,
  returnStatement,
  SequenceExpression,
} from '@babel/types';

export const UNWRAP_EXPRESSIONS: Visitor = {
  LogicalExpression: function (path: NodePath<LogicalExpression>) {
    const parent = path.parentPath;
    if (path.node.operator !== '&&' || !parent.isExpressionStatement()) return;
    const consequent = path.get('right');
    const condition = path.get('left');
    const consequentBlock = blockStatement([
      expressionStatement(consequent.node),
    ]);
    const ifStatementNode = ifStatement(condition.node, consequentBlock);
    parent.replaceWith(ifStatementNode);
  },
  SequenceExpression: function (path: NodePath<SequenceExpression>) {
    const parent = path.parentPath;
    const expressions = path.get('expressions');
    const statements = expressions.map((e) => expressionStatement(e.node));

    if (parent.isExpressionStatement()) {
      parent.replaceWithMultiple(statements);
      return;
    }

    if (parent.isConditionalExpression()) {
      const parentStatement = parent.parentPath;
      if (!parentStatement.isExpressionStatement()) return;
      const condition = parent.get('test');
      const consequent = parent.get('consequent');
      const alternate = parent.get('alternate');
      const consequentBlock = blockStatement([
        expressionStatement(consequent.node),
      ]);
      const alternateBlock = blockStatement([
        expressionStatement(alternate.node),
      ]);
      const ifStatementNode = ifStatement(
        condition.node,
        consequentBlock,
        alternateBlock,
      );
      parentStatement.replaceWith(ifStatementNode);
      return;
    }

    if (parent.isReturnStatement()) {
      statements.pop();
      const lastExpression = expressions.pop();
      if (!lastExpression) return;
      const returnStatementNode = returnStatement(lastExpression.node);
      parent.replaceWithMultiple([...statements, returnStatementNode]);
    }
  },
};
