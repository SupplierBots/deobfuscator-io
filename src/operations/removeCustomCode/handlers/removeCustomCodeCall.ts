import { NodePath } from '@babel/traverse';
import { FunctionParent, isNodesEquivalent } from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';

export const removeCustomCodeCall = (path: NodePath<FunctionParent>) => {
  const statement = path.getStatementParent();
  if (!statement) return;

  if (statement.isVariableDeclaration()) {
    const declarations = statement.get(PathListKey.Declarations);
    if (declarations.length !== 1) return;
    const [declarator] = declarations;
    const id = declarator.get(PathKey.Id);
    if (!id.isIdentifier()) return;
    const nextStatement = statement.getNextSibling();
    if (!nextStatement.isExpressionStatement()) return;
    const expression = nextStatement.get(PathKey.Expression);
    if (!expression.isCallExpression()) return;
    const callee = expression.get(PathKey.Callee);
    if (!isNodesEquivalent(callee.node, id.node)) return;
    nextStatement.remove();
    statement.remove();
    return;
  }

  if (statement.isExpressionStatement()) {
    const statementParent = statement.parentPath;
    if (!statementParent.isBlockStatement() || statement.key !== 0) return;
    const statementFunction = statementParent.parentPath;
    if (
      !statementFunction.isFunctionExpression() ||
      statementFunction.key !== 'callee'
    )
      return;
    const expression = statementFunction.parentPath;
    if (!expression.isCallExpression() || expression.node.arguments.length > 0)
      return;
    expression.getStatementParent()?.remove();
    return;
  }
  throw new Error(`Unexpected custom code call type: ${statement.type}`);
};
