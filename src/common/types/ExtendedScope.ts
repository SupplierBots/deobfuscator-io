import { Scope } from '@babel/traverse';

export interface ExtendedScope extends Scope {
  uid: number;
}
