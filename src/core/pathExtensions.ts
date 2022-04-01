import { Binding, NodePath } from '@babel/traverse';

export {};

declare module '@babel/traverse' {
  interface NodePath {
    findBinding(this: NodePath, name: string): Binding | undefined;
  }
}
NodePath.prototype.findBinding = function (name: string): Binding | undefined {
  return this.find((p) => p.scope.hasOwnBinding(name))?.scope.bindings[name];
};
