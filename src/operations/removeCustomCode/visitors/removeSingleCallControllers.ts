import { NodePath, Visitor } from '@babel/traverse';
import { ConditionalExpression } from '@babel/types';
import { findBinding } from '@core/pathExtensions';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';

export const REMOVE_SINGLE_CALL_CONTROLLERS: Visitor = {
  ConditionalExpression(path: NodePath<ConditionalExpression>) {
    if (path.key !== PathKey.Init) return;
    if (!path.get(PathKey.Consequent).isFunctionExpression()) return;
    const alternate = path.get(PathKey.Alternate);
    if (!alternate.isFunctionExpression() || alternate.node.params.length !== 0)
      return;
    const alternateBody = alternate.get(PathKey.Body);
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
    const [declarator] = outerStatement.get(PathListKey.Declarations);
    const id = declarator.get(PathKey.Id);
    if (!id.isIdentifier()) return;
    const binding = findBinding(path, id.node.name);
    if (!binding) return;
    binding.referencePaths.forEach((ref) => {
      if (ref.key !== PathKey.Callee) return;
      const refParent = ref.parentPath;
      if (!refParent?.isCallExpression()) return;
      const args = refParent.get(PathListKey.Arguments);
      if (args.length !== 2 || !args[0].isThisExpression()) return;
      refParent.replaceWith(args[1].node);
    });
    outerStatement.remove();
  },
};
