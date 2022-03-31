import { NodePath } from '@babel/traverse';
import { CallExpression } from '@babel/types';

export const isCallWrapper = (path: NodePath<CallExpression>) => {
  const callArguments = path.get('arguments');
  return (
    Array.isArray(callArguments) &&
    callArguments.length === 2 &&
    callArguments[0].isThisExpression()
  );
};
