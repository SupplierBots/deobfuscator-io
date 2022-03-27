import { NodePath } from '@babel/traverse';

export function getPrevSibling(path: NodePath): NodePath {
  // @ts-expect-error missing required types
  return path.getSibling(path.key - 1);
}

export function getNextSibling(path: NodePath): NodePath {
  // @ts-expect-error missing required types
  return path.getSibling(path.key + 1);
}
