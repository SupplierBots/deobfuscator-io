import { Node } from '@babel/types';
import traverse, { NodePath, TraverseOptions } from '@babel/traverse';

export const traverseUtils = {
  runVisitors: <T>(
    ast: Node | Node[],
    state: T,
    ...visitors: TraverseOptions<T>[]
  ): T => {
    for (const visitor of visitors) {
      traverse<T>(ast, visitor, undefined, state);
    }
    return state;
  },
  runPathVisitors: <T>(
    path: NodePath,
    state: T,
    ...visitors: TraverseOptions<T>[]
  ): T => {
    for (const visitor of visitors) {
      path.traverse(visitor, state);
    }
    return state;
  },
};
