import { NodePath, Visitor } from '@babel/traverse';
import {
  ArrowFunctionExpression,
  BinaryExpression,
  callExpression,
  cloneDeepWithoutLoc,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  identifier,
  isBinaryExpression,
  isExpression,
  Scopable,
} from '@babel/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

type BindingKind = 'var' | 'let' | 'const' | 'hoisted' | 'param';

export const REMOVE_FUNCTION_WRAPPERS: Visitor<ObfuscatedStringsState> = {
  Scopable(path: NodePath<Scopable>, state: ObfuscatedStringsState) {
    const parent = path.parentPath;
    if (parent && parent.isFunctionParent()) return;

    for (const binding of Object.values(path.scope.bindings)) {
      const bindingStatement = binding.path.getStatementParent();
      if (
        (binding.kind as BindingKind) === 'param' ||
        !bindingStatement ||
        bindingStatement.parentPath.isProgram()
      )
        continue;

      let functionPath: NodePath<
        FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
      >;

      if (bindingStatement.isVariableDeclaration()) {
        const [declarator] = bindingStatement.get('declarations');
        const init = declarator.get('init');
        if (!init.isFunctionExpression() && !init.isArrowFunctionExpression())
          continue;
        functionPath = init;
      } else if (bindingStatement.isFunctionDeclaration()) {
        functionPath = bindingStatement;
      } else {
        continue;
      }

      const functionBody = functionPath.get('body');
      if (!functionBody.isBlockStatement()) continue;
      const [bodyStatement] = functionBody.get('body');
      if (!bodyStatement.isReturnStatement()) continue;
      const returnArgument = bodyStatement.get('argument');
      if (!returnArgument.isCallExpression()) continue;
      const callee = returnArgument.get('callee');
      if (!callee.isIdentifier()) continue;

      const originalFunctionName = Object.keys(state.arrayFunctions).find(
        (f) => f === callee.node.name,
      );
      if (!originalFunctionName) continue;

      const referencedParams: {
        index: number;
        targetIndex: number;
        node: BinaryExpression | Identifier;
      }[] = [];

      for (const paramBinding of Object.values(functionPath.scope.bindings)) {
        if (
          (paramBinding.kind as BindingKind) !== 'param' ||
          !paramBinding.constant
        )
          continue;
        if (!paramBinding.referenced || paramBinding.references !== 1) continue;

        const index = paramBinding.path.key as number;
        const [reference] = paramBinding.referencePaths;
        const argumentPath = reference.find((p) => p.listKey === 'arguments');

        if (!argumentPath) continue;

        const targetIndex = argumentPath.key as number;

        if (argumentPath.isBinaryExpression()) {
          referencedParams.push({
            index,
            node: cloneDeepWithoutLoc(argumentPath.node),
            targetIndex,
          });
        } else if (reference.isIdentifier()) {
          referencedParams.push({
            index,
            node: cloneDeepWithoutLoc(reference.node),
            targetIndex,
          });
        }
      }

      for (const reference of binding.referencePaths) {
        if (!reference.parentPath?.isCallExpression()) continue;
        const args = reference.parentPath.get('arguments');
        const clonedArgs: Expression[] = [];
        for (const param of referencedParams) {
          const argument = args[param.index];

          if (!argument || !isExpression(argument.node)) continue;

          if (isBinaryExpression(param.node)) {
            const paramClone = recreateBinaryExpression(
              param.node,
              argument.node,
            );
            clonedArgs.splice(param.targetIndex, 0, paramClone);
          } else {
            clonedArgs.splice(
              param.targetIndex,
              0,
              cloneDeepWithoutLoc(argument.node),
            );
          }
        }

        const originalCall = callExpression(
          identifier(originalFunctionName),
          clonedArgs,
        );
        reference.parentPath.replaceWith(originalCall);
        reference.parentPath.scope.crawl();
      }
      functionPath.scope.crawl();
      bindingStatement.remove();
    }
  },
};

function recreateBinaryExpression(
  original: BinaryExpression,
  leftReplacement: Expression,
) {
  if (!isBinaryExpression(original.left)) {
    const clone = cloneDeepWithoutLoc(original);
    clone.left = cloneDeepWithoutLoc(leftReplacement);
    return clone;
  }

  const clone = cloneDeepWithoutLoc(original);
  clone.left = recreateBinaryExpression(original.left, leftReplacement);
  return clone;
}
