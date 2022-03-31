import { NodePath } from '@babel/traverse';
import { MemberExpression, stringLiteral } from '@babel/types';
import { ProxiesContainer } from '../types/ProxiesContainer';

export const removeLiteralProxy = (
  path: NodePath<MemberExpression>,
  proxiesContainer: ProxiesContainer,
) => {
  const { stringLiterals } = proxiesContainer;

  const property = path.get('property');
  if (!property.isStringLiteral()) return false;
  const propertyName = property.node.value;

  if (!(propertyName in stringLiterals)) return false;

  path.replaceWith(stringLiteral(stringLiterals[propertyName]));
  proxiesContainer.foundReferences++;
  return true;
};
