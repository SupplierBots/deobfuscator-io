import { Binding, NodePath } from '@babel/traverse';
import { Identifier, StringLiteral } from '@babel/types';

export {};

declare module '@babel/traverse' {
  interface NodePath {
    findBinding(this: NodePath, name: string): Binding | undefined;
    getValue(this: NodePath<StringLiteral | Identifier>): string;
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
