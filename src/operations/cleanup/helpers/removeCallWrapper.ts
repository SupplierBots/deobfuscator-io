import { NodePath } from '@babel/traverse';
import { CallExpression } from '@babel/types';

export const removeCallWrapper = (callExpression: NodePath<CallExpression>) => {
  const callee = callExpression.get('callee');
  if (!callee.isIdentifier()) return;
  const wrapperName = callee.node.name;
  const wrapperScopable = callExpression.find((p) => {
    if (!p.isScopable()) return false;
    return Object.keys(p.scope.bindings).includes(wrapperName);
  });
  if (!wrapperScopable) return;
  const wrapperBinding = wrapperScopable.scope.bindings[wrapperName];
  wrapperBinding.path.remove();
};
