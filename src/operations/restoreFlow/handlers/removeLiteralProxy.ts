import { NodePath } from '@babel/traverse';
import { MemberExpression, stringLiteral } from '@babel/types';
import { PathKey } from 'core/types';
import { ProxiesState } from '../types/ProxiesState';

export const removeLiteralProxy = (
  path: NodePath<MemberExpression>,
  state: ProxiesState,
) => {
  const { stringLiterals } = state;

  const property = path.get(PathKey.Property);
  if (!property.isStringLiteral()) return false;
  const propertyName = property.node.value;

  if (!(propertyName in stringLiterals)) return false;

  path.replaceWith(stringLiteral(stringLiterals[propertyName]));
  state.foundReferences++;
  return true;
};
