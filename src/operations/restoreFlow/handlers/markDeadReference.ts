import { NodePath } from '@babel/traverse';
import { identifier, Node } from '@babel/types';
import { ProxiesState } from '../types/ProxiesState';

export const markDeadReference = (
  path: NodePath<Node>,
  state: ProxiesState,
) => {
  state.fakeReferences++;
  state.foundReferences++;
  path.replaceWith(identifier('deadReference'));
};
