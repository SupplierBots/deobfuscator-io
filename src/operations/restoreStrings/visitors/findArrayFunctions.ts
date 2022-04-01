import { NodePath, Visitor } from '@babel/traverse';
import { Identifier, isNodesEquivalent, MemberExpression } from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';
import { ArrayEncryption } from '../types/ArrayEncryption';

export const FIND_ARRAY_FUNCTIONS: Visitor<ObfuscatedStringsState> = {
  MemberExpression: function (
    path: NodePath<MemberExpression>,
    state: ObfuscatedStringsState,
  ) {
    const object = path.get('object');
    if (!isNodesEquivalent(object.node, state.stringArrayIdentifier?.node)) {
      return;
    }

    const declaration = path
      .find(
        (p) =>
          p.isFunction() &&
          (p.getStatementParent()?.parentPath?.isProgram() ?? false),
      )
      ?.getStatementParent();

    if (!declaration) return;

    let id: NodePath<Identifier>;

    if (declaration.isFunctionDeclaration()) {
      const declarationId = declaration.get('id');
      if (!declarationId.isIdentifier()) return;
      id = declarationId;
    } else if (declaration.isVariableDeclaration()) {
      const [declarator] = declaration.get('declarations');
      const declaratorId = declarator.get('id');
      if (!declaratorId.isIdentifier()) return;
      id = declaratorId;
    } else {
      return;
    }

    const statement = object.getStatementParent();
    if (!statement) return;
    const previousPath = statement.getPrevSibling();
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

    declaration.traverse(
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
    state.arrayFunctions[id.node.name] = {
      offset,
      declaration,
      identifier: id,
      encryption: encryption.name,
    };
  },
};
