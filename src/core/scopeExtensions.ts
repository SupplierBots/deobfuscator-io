import { Scope } from '@babel/traverse';
import { ExtendedScope } from './types/ExtendedScope';

export {};

declare module '@babel/traverse' {
  interface Scope {
    getUid(this: Scope): number;
  }
}
Scope.prototype.getUid = function (): number {
  return (this as ExtendedScope).uid;
};
