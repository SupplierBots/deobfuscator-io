import { NodePath, Visitor } from '@babel/traverse';
import { Scopable } from '@babel/types';
import { AnalysisResult } from '../types/AnalysisResult';

type BindingKind = 'var' | 'let' | 'const' | 'hoisted' | 'param';

export const REMOVE_VARIABLE_WRAPPERS: Visitor<AnalysisResult> = {
  Scopable: function (path: NodePath<Scopable>, state: AnalysisResult) {
    if (path.parentPath?.isFunctionParent()) return;

    for (const [name, binding] of Object.entries(path.scope.bindings)) {
      if (
        (binding.kind as BindingKind) === 'hoisted' ||
        (binding.kind as BindingKind) === 'param'
      )
        continue;
      const bindingPath = binding.path;
      if (!bindingPath.isVariableDeclarator()) return;
      const init = bindingPath.get('init');
      if (!init.isIdentifier()) return;
      const arrayFunction = state.arrayFunctions.find(
        (f) => f.identifier.node.name === init.node.name,
      );
      if (!arrayFunction) return;
      path.scope.rename(name, arrayFunction.identifier.node.name);
      bindingPath.remove();
      binding.scope.crawl();
    }
  },
};
