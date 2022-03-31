import { NodePath, Visitor } from '@babel/traverse';
import { NewExpression } from '@babel/types';
import { isCallWrapper } from '../helpers/isCallWrapper';
import { removeCallWrapper } from '../helpers/removeCallWrapper';

export const REMOVE_DEBUG_PROTECTION: Visitor = {
  NewExpression(path: NodePath<NewExpression>) {
    const callee = path.get('callee');
    if (!callee.isIdentifier({ name: 'RegExp' })) return;
    const args = path.get('arguments');
    if (args.length !== 2) return;
    const [pattern, flag] = args;
    if (!flag.isStringLiteral({ value: 'i' })) return;
    if (
      !pattern.isStringLiteral({
        value: '\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)',
      })
    )
      return;
    const nextPath = path.getStatementParent()?.getNextSibling();
    if (!nextPath?.isVariableDeclaration()) return;
    const [declarator] = nextPath.get('declarations');
    const init = declarator.get('init');
    if (!init.isCallExpression()) return;
    const initArgs = init.get('arguments');
    if (initArgs.length !== 1) return;
    if (!initArgs[0].isStringLiteral({ value: 'init' })) return;
    const debugLoopId = init.get('callee');
    if (!debugLoopId.isIdentifier()) return;
    const debugLoopName = debugLoopId.node.name;
    const debugLoopBinding = path.find((p) =>
      p.scope.hasOwnBinding(debugLoopName),
    )?.scope.bindings[debugLoopName];
    if (!debugLoopBinding) return;

    const functionParent = path.getFunctionParent();
    if (!functionParent || functionParent.key !== 1) return;
    const hookExpression = functionParent.parentPath;
    if (!hookExpression.isCallExpression() || !isCallWrapper(hookExpression))
      return;
    removeCallWrapper(hookExpression);
    hookExpression.getFunctionParent()?.getStatementParent()?.remove();
    const intervalCall = debugLoopBinding.referencePaths.find(
      (r) => !r.removed,
    );
    intervalCall?.getFunctionParent()?.getStatementParent()?.remove();
    debugLoopBinding.path.remove();
  },
};
