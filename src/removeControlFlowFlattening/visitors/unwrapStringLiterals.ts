import { NodePath, Visitor } from '@babel/traverse';
import { MemberExpression, stringLiteral } from '@babel/types';
import { ProxiesContainer } from '../types/ProxiesContainer';

export const UNWRAP_STRING_LITERALS: Visitor<ProxiesContainer> = {
  MemberExpression: function (
    path: NodePath<MemberExpression>,
    proxiesContainer: ProxiesContainer,
  ) {
    const object = path.get('object');
    if (!object.isIdentifier()) return;
    const objectName = object.node.name;
    if (objectName !== proxiesContainer.name) return;

    const { stringLiterals } = proxiesContainer;

    const property = path.get('property');
    if (!property.isStringLiteral()) return;
    const propertyName = property.node.value;

    if (!(propertyName in stringLiterals)) return;

    path.replaceWith(stringLiteral(stringLiterals[propertyName]));
    path.scope.crawl();
    proxiesContainer.foundReferences++;
  },
};
