import { NodePath, Visitor } from '@babel/traverse';
import {
  cloneDeepWithoutLoc,
  identifier,
  isIdentifier,
  isValidIdentifier,
  objectExpression,
  objectProperty,
  Scopable,
} from '@babel/types';
import { PathKey, PathListKey } from 'core/types';

export const RESTORE_OBJECT_EXPRESSIONS: Visitor = {
  Scopable: function (path: NodePath<Scopable>) {
    const parent = path.parentPath;
    if (parent && parent.isFunctionParent()) return;

    for (const binding of Object.values(path.scope.bindings)) {
      if (!binding.constant || !binding.path.isVariableDeclarator()) continue;
      const init = binding.path.get(PathKey.Init);
      if (!init.isObjectExpression()) continue;
      const properties = init.get(PathListKey.Properties);
      if (properties.length !== 0) continue;

      const references = binding.referencePaths;
      const [reassignment] = references.splice(references.length - 1, 1);
      if (!reassignment.parentPath?.isVariableDeclarator()) continue;

      const parsedProperties = [];
      for (const reference of references) {
        if (reference.key !== PathKey.Object) break;
        const parent = reference.parentPath;
        if (!parent?.isMemberExpression()) continue;
        const property = parent.get(PathKey.Property);
        if (!property.isExpression()) continue;
        const expression = parent.parentPath;
        if (!expression.isAssignmentExpression()) continue;
        const right = expression.get(PathKey.Right);

        const key =
          property.isStringLiteral() && isValidIdentifier(property.node.value)
            ? identifier(property.node.value)
            : cloneDeepWithoutLoc(property.node);

        parsedProperties.push({
          property: objectProperty(
            key,
            cloneDeepWithoutLoc(right.node),
            !isIdentifier(key),
          ),
          expression,
        });
      }
      reassignment.replaceWith(
        objectExpression(parsedProperties.map((p) => p.property)),
      );
      parsedProperties.forEach((p) => {
        const expressionParent = p.expression.parentPath;
        if (
          expressionParent.isSequenceExpression() &&
          expressionParent.node.expressions.length == 1
        ) {
          expressionParent.remove();
          return;
        }
        p.expression.remove();
      });
      binding.scope.crawl();
      binding.path.remove();
    }
  },
};
