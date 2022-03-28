import { NodePath, Visitor } from '@babel/traverse';
import { blockStatement, IfStatement } from '@babel/types';

export const ADD_MISSING_BLOCK_STATEMENTS: Visitor = {
  IfStatement: function (path: NodePath<IfStatement>) {
    const consequent = path.get('consequent');
    const alternate = path.get('alternate');
    if (consequent.node && !consequent.isBlockStatement()) {
      const block = blockStatement([consequent.node]);
      consequent.replaceWith(block);
    }
    if (alternate.node && !alternate.isBlockStatement()) {
      const block = blockStatement([alternate.node]);
      alternate.replaceWith(block);
    }
  },
};
