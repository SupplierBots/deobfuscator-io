import { NodePath, Visitor } from '@babel/traverse';
import { StringLiteral } from '@babel/types';
import { getValue } from '@core/pathExtensions';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { removeCustomCodeCall } from '../handlers/removeCustomCodeCall';

export const REMOVE_SELF_DEFENDING: Visitor = {
  StringLiteral(path: NodePath<StringLiteral>) {
    const selfDefendingVariants: Record<string, string> = {
      '(((.+)+)+)+$': 'search',
      '^([^ ]+( +[^ ]+)+)+[^ ]}': 'constructor',
    };
    const value = path.node.value;
    if (!Object.keys(selfDefendingVariants).includes(value) || path.key !== 0)
      return;
    const parent = path.parentPath;
    if (!parent.isCallExpression()) return;
    if (parent.parentPath.isReturnStatement()) return;
    const callee = parent.get(PathKey.Callee);
    if (!callee.isMemberExpression()) return;
    const property = callee.get(PathKey.Property);
    if (!property.isStringLiteral() && !property.isIdentifier()) return;
    const propertyValue = getValue(property);
    if (propertyValue !== selfDefendingVariants[value]) return;
    const functionExpression = path.findParent((p) => {
      if (!p.isFunctionExpression()) return false;
      const body = p.get(PathKey.Body);
      if (Array.isArray(body) || !body.isBlockStatement()) {
        return false;
      }
      const paths = body.get(PathListKey.Body);
      if (!Array.isArray(paths)) return false;
      const lastPath = paths.pop();
      if (!lastPath?.isReturnStatement()) return false;
      const argument = lastPath.get(PathKey.Argument);
      return argument.isCallExpression();
    });
    if (!functionExpression?.isFunctionParent()) {
      return;
    }
    removeCustomCodeCall(functionExpression);
  },
};
