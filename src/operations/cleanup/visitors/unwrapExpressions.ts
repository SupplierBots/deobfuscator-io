import { NodePath, Visitor } from '@babel/traverse';
import {
  blockStatement,
  expressionStatement,
  ifStatement,
  LogicalExpression,
  returnStatement,
  SequenceExpression,
} from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';

export const UNWRAP_EXPRESSIONS: Visitor = {
  LogicalExpression: function (path: NodePath<LogicalExpression>) {
    const parent = path.parentPath;
    if (path.node.operator !== '&&' || !parent.isExpressionStatement()) return;
    const consequent = path.get(PathKey.Right);
    const condition = path.get(PathKey.Left);
    const consequentBlock = blockStatement([
      expressionStatement(consequent.node),
    ]);
    const ifStatementNode = ifStatement(condition.node, consequentBlock);
    parent.replaceWith(ifStatementNode);
  },
  SequenceExpression: function (path: NodePath<SequenceExpression>) {
    const parent = path.parentPath;
    const expressions = path.get(PathListKey.Expressions);
    const statements = expressions.map((e) => expressionStatement(e.node));

    if (parent.isExpressionStatement()) {
      parent.replaceWithMultiple(statements);
      return;
    }

    if (parent.isConditionalExpression()) {
      const parentStatement = parent.parentPath;
      if (!parentStatement.isExpressionStatement()) return;
      const condition = parent.get(PathKey.Test);
      const consequent = parent.get(PathKey.Consequent);
      const alternate = parent.get(PathKey.Alternate);
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
