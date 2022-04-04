import { NodePath, Visitor } from '@babel/traverse';
import { Scopable } from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

type BindingKind = 'var' | 'let' | 'const' | 'hoisted' | 'param';

export const REMOVE_VARIABLE_WRAPPERS: Visitor<ObfuscatedStringsState> = {
  Scopable: function (path: NodePath<Scopable>, state: ObfuscatedStringsState) {
    const parent = path.parentPath;
    if (parent && parent.isFunctionParent()) return;

    for (const [name, binding] of Object.entries(path.scope.bindings)) {
      if (
        (binding.kind as BindingKind) === 'hoisted' ||
        (binding.kind as BindingKind) === 'param'
      )
        continue;
      const bindingPath = binding.path;
      if (!bindingPath.isVariableDeclarator()) continue;
      const init = bindingPath.get(PathKey.Init);
      if (!init.isIdentifier()) continue;
      const arrayFunctionName = Object.keys(state.getters).find(
        (f) => f === init.node.name,
      );
      if (!arrayFunctionName) continue;
      path.scope.rename(name, arrayFunctionName);
      bindingPath.remove();
      binding.scope.crawl();
    }
  },
};
