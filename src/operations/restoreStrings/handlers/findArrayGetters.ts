import { pathUtils } from 'core';
import { PathKey } from 'core/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';
import { parseArrayGetter } from './parseArrayGetter';

export const findArrayGetters = (state: ObfuscatedStringsState) => {
  state.arrayBinding?.referencePaths.forEach((ref) => {
    const refParent = ref.parentPath;
    if (refParent?.isMemberExpression()) {
      parseArrayGetter(refParent, state);
      return;
    }
    if (!refParent?.isCallExpression() || refParent.key !== PathKey.Init) {
      return;
    }

    const declarator = refParent.parentPath;
    if (!declarator.isVariableDeclarator()) return;
    const aliasId = declarator.get(PathKey.Id);
    if (!aliasId.isIdentifier()) return;
    const aliasBinding = pathUtils.findBinding(ref, aliasId.node.name);
    if (!aliasBinding) return;
    aliasBinding.referencePaths.forEach((aliasRef) => {
      const aliasRefParent = aliasRef.parentPath;
      if (!aliasRefParent?.isMemberExpression()) return;
      parseArrayGetter(aliasRefParent, state);
    });
  });
};
