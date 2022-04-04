import { NodePath } from '@babel/traverse';
import { Identifier, MemberExpression } from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';
import { ArrayEncryption } from '../types/ArrayEncryption';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';

export const parseArrayGetter = (
  path: NodePath<MemberExpression>,
  state: ObfuscatedStringsState,
) => {
  const object = path.get(PathKey.Object);

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
    const declarationId = declaration.get(PathKey.Id);
    if (!declarationId.isIdentifier()) return;
    id = declarationId;
  } else if (declaration.isVariableDeclaration()) {
    const [declarator] = declaration.get(PathListKey.Declarations);
    const declaratorId = declarator.get(PathKey.Id);
    if (!declaratorId.isIdentifier()) return;
    id = declaratorId;
  } else {
    return;
  }

  const statement = object.getStatementParent();
  if (!statement) return;
  const previousPath = statement.getPrevSibling();
  if (!previousPath.isExpressionStatement()) return;
  const expression = previousPath.get(PathKey.Expression);
  if (!expression.isAssignmentExpression()) return;
  const assignmentRight = expression.get(PathKey.Right);
  if (!assignmentRight.isBinaryExpression()) return;
  const binaryRight = assignmentRight.get(PathKey.Right);
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
        if (path.key !== PathKey.Test) return;
        const right = path.get(PathKey.Right);
        if (!right.isNumericLiteral({ value: 256 })) return;
        encryption.name = 'rc4';
      },
    },
    encryption,
  );
  const offset = parseInt(binaryRight.toString());

  state.getters[id.node.name] = {
    offset,
    declaration,
    identifier: id,
    encryption: encryption.name,
  };
};
