import { NodePath, Visitor } from '@babel/traverse';
import { NewExpression } from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { removeCustomCodeCall } from '../handlers/removeCustomCodeCall';

export const REMOVE_DEBUG_PROTECTION: Visitor = {
  NewExpression(path: NodePath<NewExpression>) {
    const callee = path.get(PathKey.Callee);
    if (!callee.isIdentifier({ name: 'RegExp' })) return;
    const args = path.get(PathListKey.Arguments);
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
    const [declarator] = nextPath.get(PathListKey.Declarations);
    const init = declarator.get(PathKey.Init);
    if (!init.isCallExpression()) return;
    const initArgs = init.get(PathListKey.Arguments);
    if (initArgs.length !== 1) return;
    if (!initArgs[0].isStringLiteral({ value: 'init' })) return;
    const debugLoopId = init.get(PathKey.Callee);
    if (!debugLoopId.isIdentifier()) return;
    const debugLoopName = debugLoopId.node.name;
    const debugLoopBinding = path.findBinding(debugLoopName);
    if (!debugLoopBinding) return;
    debugLoopBinding.referencePaths.forEach((ref) => {
      if (!ref.parentPath?.isCallExpression()) return;
      if (ref.key === 0) {
        const id = ref.parentPath?.getNested('callee.property');
        if (
          !Array.isArray(id) &&
          id?.isIdentifier() &&
          id.node.name === 'setInterval'
        ) {
          ref
            .getStatementParent()
            ?.getFunctionParent()
            ?.getStatementParent()
            ?.remove();
          return;
        }
      }
      if (ref.key !== PathKey.Callee) return;
      const expression = ref.getFunctionParent()?.parentPath;
      if (!expression?.isCallExpression()) return;
      const callee = expression.get(PathKey.Callee);
      if (!callee.isIdentifier({ name: 'setInterval' })) return;
      expression.getStatementParent()?.remove();
    });
    const parent = init.getFunctionParent();
    if (parent?.isFunctionParent()) {
      removeCustomCodeCall(parent);
    }
    debugLoopBinding.path.remove();
  },
};