import { NodePath, Visitor } from '@babel/traverse';
import {
  cloneDeepWithoutLoc,
  NumericLiteral,
  ObjectExpression,
  StringLiteral,
} from '@babel/types';
import { findBinding } from '@core/pathExtensions';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

export const REMOVE_GETTERS_ARGUMENTS_WRAPPERS: Visitor<ObfuscatedStringsState> = {
  ObjectExpression: function (path: NodePath<ObjectExpression>) {
    if (path.key !== PathKey.Init) return;
    const properties = path.get(PathListKey.Properties);
    if (properties.length < 1) return;
    const indexes: { [key: string]: StringLiteral | NumericLiteral } = {};
    const isIndexWrapper = properties.every((p) => {
      if (!p.isObjectProperty()) return false;
      const key = p.get(PathKey.Key);
      if (!key.isIdentifier()) return false;
      const value = p.get(PathKey.Value);
      if (!value.isStringLiteral() && !value.isNumericLiteral()) return false;
      indexes[key.node.name] = cloneDeepWithoutLoc(value.node);
      return true;
    });
    if (!isIndexWrapper) return;
    const parent = path.parentPath;
    if (!parent.isVariableDeclarator()) return;
    const objectId = parent.get(PathKey.Id);
    if (!objectId.isIdentifier()) return;
    const binding = findBinding(path, objectId.node.name);
    if (
      !binding?.constant ||
      !binding.referencePaths.every((p) => p.parentPath?.isMemberExpression())
    ) {
      return;
    }

    binding.referencePaths.forEach((ref) => {
      const refParent = ref.parentPath;
      if (!refParent?.isMemberExpression()) return;
      const property = refParent.get(PathKey.Property);
      if (!property.isIdentifier()) return;
      refParent.replaceWith(indexes[property.node.name]);
    });
    parent.remove();
  },
};
