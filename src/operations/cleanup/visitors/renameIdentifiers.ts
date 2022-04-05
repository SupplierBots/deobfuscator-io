import { NodePath, Visitor } from '@babel/traverse';
import { Scopable } from '@babel/types';
import { PathKey } from '@core/types/PathKey';

export const RENAME_IDENTIFIERS: Visitor = {
  Scopable(path: NodePath<Scopable>) {
    const parent = path.parentPath;
    if (parent && parent.isFunctionParent()) return;

    for (const [name, binding] of Object.entries(path.scope.bindings)) {
      const trimmedName = name.replace('_0x', '');
      if ((binding.kind as string) === 'param') {
        path.scope.rename(name, `p_${trimmedName}`);
        continue;
      }
      if (binding.path.isFunction()) {
        path.scope.rename(name, `fn_${trimmedName}`);
        continue;
      }
      if (binding.path.isVariableDeclarator()) {
        const init = binding.path.get(PathKey.Init);
        const prefix = init.isFunction() ? 'fn' : 'v';
        path.scope.rename(name, `${prefix}_${trimmedName}`);
      }
    }
  },
};
