import { NodePath, Visitor } from '@babel/traverse';
import { isNodesEquivalent, MemberExpression } from '@babel/types';
import { getPrevSibling } from '../../common/babelExtensions';
import { AnalysisResult } from '../types/AnalysisResult';
import { ArrayEncryption } from '../types/ArrayEncryption';

export const FIND_ARRAY_FUNCTIONS: Visitor<AnalysisResult> = {
  MemberExpression: function (
    path: NodePath<MemberExpression>,
    state: AnalysisResult,
  ) {
    const object = path.get('object');
    if (!isNodesEquivalent(object.node, state.stringArrayIdentifier?.node)) {
      return;
    }

    const functionDeclaration = path.findParent((p) =>
      p.isFunctionDeclaration(),
    );

    if (!functionDeclaration?.isFunctionDeclaration()) return;
    const id = functionDeclaration.get('id');
    if (!id.isIdentifier()) return;

    const statement = object.getStatementParent();
    if (!statement) return;
    const previousPath = getPrevSibling(statement);
    if (!previousPath.isExpressionStatement()) return;
    const expression = previousPath.get('expression');
    if (!expression.isAssignmentExpression()) return;
    const assignmentRight = expression.get('right');
    if (!assignmentRight.isBinaryExpression()) return;
    const binaryRight = assignmentRight.get('right');
    if (
      !binaryRight.isUnaryExpression({ operator: '-' }) &&
      !binaryRight.isNumericLiteral()
    ) {
      return;
    }

    const encryption: { name: ArrayEncryption } = {
      name: 'none',
    };

    functionDeclaration.traverse(
      {
        StringLiteral(path, encryption) {
          const value = path.node.value;
          if (
            value !==
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='
          ) {
            return;
          }
          encryption.name = 'base64';
        },
        BinaryExpression(path, encryption) {
          if (path.node.operator !== '<') return;
          if (path.key !== 'test') return;
          const right = path.get('right');
          if (!right.isNumericLiteral({ value: 256 })) return;
          encryption.name = 'rc4';
        },
      },
      encryption,
    );
    const offset = parseInt(binaryRight.toString());

    state.arrayFunctions.push({
      offset,
      identifier: id,
      path: functionDeclaration,
      encryption: encryption.name,
    });
  },
};
