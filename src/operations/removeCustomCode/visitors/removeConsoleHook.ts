import { NodePath, Visitor } from '@babel/traverse';
import { ArrayExpression } from '@babel/types';
import { PathListKey } from '@core/types/PathListKey';
import { removeCustomCodeCall } from '../handlers/removeCustomCodeCall';

export const REMOVE_CONSOLE_HOOK: Visitor = {
  ArrayExpression(path: NodePath<ArrayExpression>) {
    const elementsPaths = path.get(PathListKey.Elements);
    const elements = elementsPaths.map((e) => {
      if (e.isStringLiteral()) {
        return e.node.value;
      }
      return null;
    });
    if (!elementsPaths.every(Boolean)) return;
    const consoleFunctions = ['log', 'warn', 'error'];
    if (!consoleFunctions.every((fn) => elements.includes(fn))) return;
    const parent = path.getStatementParent()?.getFunctionParent();
    if (!parent?.isFunctionParent()) return;
    removeCustomCodeCall(parent);
  },
};
