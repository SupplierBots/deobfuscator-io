import { NodePath, Visitor } from '@babel/traverse';
import { identifier, isValidIdentifier, StringLiteral } from '@babel/types';

export const RESTORE_DOT_NOTATION: Visitor = {
  StringLiteral: function (path: NodePath<StringLiteral>) {
    if (
      !path.parentPath.isMemberExpression() &&
      !path.parentPath.isObjectProperty()
    )
      return;

    if (path.parentPath.isObjectProperty() && path.key !== 'key') return;

    if (!isValidIdentifier(path.node.value)) return;
    path.parentPath.node.computed = false;
    path.replaceWith(identifier(path.node.value));
  },
};
