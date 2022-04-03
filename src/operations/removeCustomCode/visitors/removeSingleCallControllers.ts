import { NodePath, Visitor } from '@babel/traverse';
import { ConditionalExpression } from '@babel/types';

export const REMOVE_SINGLE_CALL_CONTROLLERS: Visitor = {
  ConditionalExpression(path: NodePath<ConditionalExpression>) {
    if (path.key !== 'init') return;
    if (!path.get('consequent').isFunctionExpression()) return;
    const alternate = path.get('alternate');
    if (!alternate.isFunctionExpression() || alternate.node.params.length !== 0)
      return;
    const alternateBody = alternate.get('body');
    if (
      !alternateBody.isBlockStatement() ||
      alternateBody.node.body.length !== 0
    )
      return;
    const functionParent = path.getFunctionParent();
    if (!functionParent?.isFunctionExpression()) return;
    if (!functionParent.parentPath.isReturnStatement()) return;
    const outerStatement = functionParent
      ?.getFunctionParent()
      ?.getStatementParent();
    if (!outerStatement?.isVariableDeclaration()) return;
    const [declarator] = outerStatement.get('declarations');
    const id = declarator.get('id');
    if (!id.isIdentifier()) return;
    const binding = path.findBinding(id.node.name);
    if (!binding) return;
    binding.referencePaths.forEach((ref) => {
      if (ref.key !== 'callee') return;
      const refParent = ref.parentPath;
      if (!refParent?.isCallExpression()) return;
      const args = refParent.get('arguments');
      if (args.length !== 2 || !args[0].isThisExpression()) return;
      refParent.replaceWith(args[1].node);
    });
    outerStatement.remove();
  },
};
