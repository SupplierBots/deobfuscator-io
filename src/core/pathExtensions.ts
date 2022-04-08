import { Binding, NodePath } from '@babel/traverse';
import { Identifier, StringLiteral } from '@babel/types';

export const findBinding = function (
  path: NodePath,
  name: string,
): Binding | undefined {
  return path.find((p) => p.scope.hasOwnBinding(name))?.scope.bindings[name];
};

export const getValue = function (path: NodePath<StringLiteral | Identifier>) {
  if (path.isStringLiteral()) {
    return path.node.value;
  }
  if (path.isIdentifier()) {
    return path.node.name;
  }

  throw new Error('Unexpected property type: ' + path.type);
};

export const isList = function (path: NodePath | NodePath[]) {
  return Array.isArray(path);
};

export const getNested = function (
  path: NodePath,
  key: string,
): NodePath | NodePath[] | null {
  try {
    return path.get(key) ?? null;
  } catch (ex) {
    return null;
  }
};
