import { Binding, NodePath } from '@babel/traverse';
import { Identifier, StringLiteral } from '@babel/types';

export {};

declare module '@babel/traverse' {
  interface NodePath {
    findBinding(this: NodePath, name: string): Binding | undefined;
    getValue(this: NodePath<StringLiteral | Identifier>): string;
    toString(this: NodePath): string;
    isList(this: NodePath | NodePath[]): boolean;
    getNested(this: NodePath, key: string): NodePath | NodePath[] | null;
  }
}
NodePath.prototype.findBinding = function (name: string): Binding | undefined {
  return this.find((p) => p.scope.hasOwnBinding(name))?.scope.bindings[name];
};

NodePath.prototype.getValue = function (
  this: NodePath<StringLiteral | Identifier>,
) {
  if (this.isStringLiteral()) {
    return this.node.value;
  }
  if (this.isIdentifier()) {
    return this.node.name;
  }

  throw new Error('Unexpected property type: ' + this.type);
};

NodePath.prototype.isList = function (this: NodePath | NodePath[]) {
  return Array.isArray(this);
};

NodePath.prototype.getNested = function (
  this: NodePath,
  key: string,
): NodePath | NodePath[] | null {
  try {
    return this.get(key) ?? null;
  } catch (ex) {
    return null;
  }
};
