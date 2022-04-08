import { NodePath, Visitor } from '@babel/traverse';
import { Scopable } from '@babel/types';
import { ExtendedScope } from '../../../core/types/ExtendedScope';
import { BinaryProxy } from '../types/BinaryProxy';
import { CallProxy } from '../types/CallProxy';
import { ProxiesState } from '../types/ProxiesState';
import { removeCallProxy } from '../helpers/removeCallProxy';
import { removeLiteralProxy } from '../helpers/removeLiteralProxy';
import { markDeadReference } from '../helpers/markDeadReference';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { getValue } from '@core/pathExtensions';

type BindingKind = 'var' | 'let' | 'const' | 'hoisted' | 'param';

export const REMOVE_PROXIES: Visitor = {
  Scopable: {
    enter(path: NodePath<Scopable>) {
      const parent = path.parentPath;
      if (parent && parent.isFunctionParent()) return;

      for (const [name, binding] of Object.entries(path.scope.bindings)) {
        if (
          binding.kind !== 'var' &&
          binding.kind !== 'let' &&
          binding.kind !== 'const'
        )
          continue;

        if (!binding.path.isVariableDeclarator()) continue;
        const parent = binding.path.parentPath;
        if (!parent.isVariableDeclaration()) continue;

        const init = binding.path.get(PathKey.Init);
        if (!init.isObjectExpression()) continue;

        const scopeUid: number = (binding.scope as ExtendedScope).uid;
        const referencesCount = binding.referencePaths.filter((r) => r.node.loc)
          .length;

        const state: ProxiesState = {
          name,
          keys: [],
          stringLiterals: {},
          binaryProxies: {},
          callProxies: {},
          foundReferences: 0,
          fakeReferences: 0,
          referencesCount,
          scopeUid,
        };

        const properties = init.get(PathListKey.Properties);
        if (properties.length === 0) continue;
        if (
          !properties.every((p) => {
            if (!p.isObjectProperty()) return false;
            const key = p.get(PathKey.Key);
            let keyValue: string | null = null;
            if (key.isStringLiteral()) {
              keyValue = key.node.value;
            }
            if (key.isIdentifier()) {
              keyValue = key.node.name;
            }
            if (!keyValue) return false;

            state.keys.push(keyValue);

            const propertyValue = p.get(PathKey.Value);
            propertyValue.scope.crawl();

            if (propertyValue.isStringLiteral()) {
              state.stringLiterals[keyValue] = propertyValue.node.value;
            } else if (propertyValue.isFunctionExpression()) {
              const proxy: BinaryProxy = {
                left: null,
                right: null,
                operator: null,
              };
              const callProxy: CallProxy = {
                callee: null,
                params: [],
              };
              for (const functionBinding of Object.values(
                propertyValue.scope.bindings,
              )) {
                if (
                  (functionBinding.kind as BindingKind) !== 'param' ||
                  !functionBinding.constant ||
                  functionBinding.references !== 1 ||
                  !functionBinding.path.isIdentifier()
                ) {
                  return false;
                }

                const [paramRef] = functionBinding.referencePaths;

                if (paramRef.parentPath?.isBinary()) {
                  if (paramRef.key === PathKey.Left) {
                    proxy.left = functionBinding.path.key as number;
                  } else if (paramRef.key === PathKey.Right) {
                    proxy.right = functionBinding.path.key as number;
                  }
                  proxy.operator = paramRef.parentPath.node.operator;
                }

                if (paramRef.parentPath?.isCallExpression()) {
                  if (paramRef.key === PathKey.Callee) {
                    callProxy.callee = functionBinding.path.key as number;
                  } else if (typeof paramRef.key === 'number') {
                    callProxy.params.push({
                      targetIndex: paramRef.key,
                      functionIndex: functionBinding.path.key as number,
                    });
                  }
                }
              }
              if (Object.values(proxy).every((p) => p !== null)) {
                state.binaryProxies[keyValue] = proxy;
              }

              if (callProxy.callee !== null) {
                state.callProxies[keyValue] = callProxy;
              }
            } else {
              return false;
            }

            return true;
          })
        ) {
          continue;
        }
        path.scope.crawl();

        while (path.scope.bindings[name].referenced) {
          const ref = path.scope.bindings[name].referencePaths[0];
          const refExpression = ref.findParent((p) => p.isMemberExpression());

          if (!refExpression?.isMemberExpression()) {
            markDeadReference(ref, state);
            path.scope.crawl();
            continue;
          }

          const property = refExpression.get(PathKey.Property);
          if (!property.isStringLiteral() && !property.isIdentifier()) {
            markDeadReference(ref, state);
            path.scope.crawl();
            continue;
          }

          const propertyValue = getValue(property);
          let isRemoved = false;
          if (!state.keys.includes(propertyValue)) {
            markDeadReference(ref, state);
            isRemoved = true;
          } else if (
            refExpression.key === PathKey.Callee &&
            refExpression.parentPath.isCallExpression()
          ) {
            isRemoved =
              removeCallProxy(refExpression.parentPath, state) ?? false;
          } else {
            isRemoved = removeLiteralProxy(refExpression, state);
          }
          if (!isRemoved) {
            console.log(state);
            throw new Error(
              `Couldn't replace reference: ${refExpression.toString()}'}`,
            );
          }
          path.scope.crawl();
        }
        binding.path.remove();
      }
    },
  },
};
