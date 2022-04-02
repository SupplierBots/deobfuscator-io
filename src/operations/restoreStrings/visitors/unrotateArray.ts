import { NodePath, Visitor } from '@babel/traverse';
import { CallExpression, cloneDeepWithoutLoc } from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';
import { REPLACE_CALL_EXPRESSIONS } from './replaceCallExpressions';

export const UNROTATE_ARRAY: Visitor<ObfuscatedStringsState> = {
  CallExpression: function (
    path: NodePath<CallExpression>,
    state: ObfuscatedStringsState,
  ) {
    if (!state.stringArrayValues || !state.stringArrayIdentifier) return;
    const callee = path.get('callee');
    if (!callee.isFunctionExpression()) return;
    const [firstArgument, secondArgument] = path.get('arguments');
    if (
      !firstArgument?.isIdentifier({
        name: state.stringArrayIdentifier.node.name,
      })
    )
      return;
    if (!secondArgument?.isNumericLiteral()) return;

    const numericValue = secondArgument.node.value;

    let isSimpleRotate = true;
    callee.traverse(
      {
        TryStatement(path, state) {
          isSimpleRotate = false;

          const tryBlock = path.get('block');
          if (!tryBlock.isBlockStatement()) return;
          const [declarationPath] = tryBlock.get('body');
          if (!declarationPath.isVariableDeclaration()) return;
          const [resultDeclarator] = declarationPath.get('declarations');
          const init = resultDeclarator.get('init');

          if (!init.isExpression()) {
            throw new Error('Unexpected path in string rotation function');
          }

          const parseExpression = cloneDeepWithoutLoc(init.node);

          while (true) {
            try {
              init.traverse(REPLACE_CALL_EXPRESSIONS, state);
              const result = eval(init.toString());
              if (result === numericValue) {
                break;
              }
            } catch {}
            state.decoder?.rotateArray();
            init.replaceWith(cloneDeepWithoutLoc(parseExpression));
          }
        },
      },
      state,
    );
    if (isSimpleRotate) {
      let i = numericValue;
      while (i--) {
        state.decoder?.rotateArray();
      }
    }
    path.parentPath.remove();
  },
};
