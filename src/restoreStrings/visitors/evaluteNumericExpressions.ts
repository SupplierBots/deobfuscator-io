import { NodePath, Visitor } from '@babel/traverse';
import {
  BinaryExpression,
  booleanLiteral,
  isMemberExpression,
  isUnaryExpression,
  numericLiteral,
  stringLiteral,
  UnaryExpression,
} from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

function handler(path: NodePath<BinaryExpression | UnaryExpression>) {
  const source = path.toString();

  try {
    const value = eval(source);
    if (typeof value === 'number') {
      path.replaceWith(numericLiteral(value));
    }
    if (typeof value === 'boolean') {
      path.replaceWith(booleanLiteral(value));
    }
    if (typeof value === 'string') {
      path.replaceWith(stringLiteral(value));
    }
  } catch (ex) {
    //* Couldn't eval expression, so it shouldn't be replaced.
  }
}

export const EVALUATE_NUMERIC_EXPRESSIONS: Visitor<ObfuscatedStringsState> = {
  BinaryExpression: function (path: NodePath<BinaryExpression>) {
    if (isUnaryExpression(path.node.left, { operator: 'typeof' })) return;
    if (isMemberExpression(path.node.left)) return;
    handler(path);
  },
  UnaryExpression: function (path: NodePath<UnaryExpression>) {
    if (isUnaryExpression(path.node, { operator: 'typeof' })) return;
    handler(path);
  },
};
