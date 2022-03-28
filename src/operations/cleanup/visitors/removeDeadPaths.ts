import { NodePath, Visitor } from '@babel/traverse';
import {
  cloneDeepWithoutLoc,
  Conditional,
  expressionStatement,
} from '@babel/types';

export const REMOVE_DEAD_PATHS: Visitor = {
  Conditional: function (path: NodePath<Conditional>) {
    const condition = path.get('test');
    const { confident, value } = condition.evaluate();
    if (!confident) return;
    const statement = path.isStatement() ? path : path.getStatementParent();
    if (!statement) return;

    const evaluatedPath = path.get(value ? 'consequent' : 'alternate');
    if (evaluatedPath.node === null) {
      statement.remove();
      return;
    }

    if (evaluatedPath.isBlockStatement()) {
      const nodes = evaluatedPath.get('body').map((r) => r.node);
      statement.replaceWithMultiple(nodes);
      return;
    }

    if (evaluatedPath.isExpression()) {
      const replacement = expressionStatement(
        cloneDeepWithoutLoc(evaluatedPath.node),
      );
      statement.replaceWith(replacement);
      return;
    }

    if (!evaluatedPath.isStatement()) {
      throw new Error(`Unexpected path type: ${evaluatedPath.type}`);
    }

    statement.replaceWith(evaluatedPath.node);
  },
};
