import { NodePath, Visitor } from '@babel/traverse';
import { identifier, Scopable } from '@babel/types';
import { ExtendedScope } from '../../../core/types/ExtendedScope';
import { BinaryProxy } from '../types/BinaryProxy';
import { CallProxy } from '../types/CallProxy';
import { ProxiesContainer } from '../types/ProxiesContainer';
import { utils } from '../../../core/utils';
import { removeCallProxy } from '../helpers/removeCallProxy';
import { removeLiteralProxy } from '../helpers/removeLiteralProxy';

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

        const init = binding.path.get('init');
        if (!init.isObjectExpression()) continue;

        const scopeUid: number = (binding.scope as ExtendedScope).uid;
        const referencesCount = binding.referencePaths.filter((r) => r.node.loc)
          .length;

        const proxiesContainer: ProxiesContainer = {
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

        const properties = init.get('properties');
        if (
          properties.length === 0 ||
          !properties.every((p) => {
            if (!p.isObjectProperty()) return false;
            const key = p.get('key');
            let keyValue: string | null = null;
            if (key.isStringLiteral()) {
              keyValue = key.node.value;
            }
            if (key.isIdentifier()) {
              keyValue = key.node.name;
            }
            if (!keyValue || keyValue.length !== 5) return false;
            proxiesContainer.keys.push(keyValue);

            const propertyValue = p.get('value');
            propertyValue.scope.crawl();

            if (propertyValue.isStringLiteral()) {
              proxiesContainer.stringLiterals[keyValue] =
                propertyValue.node.value;
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
                  if (paramRef.key === 'left') {
                    proxy.left = functionBinding.path.key as number;
                  } else if (paramRef.key === 'right') {
                    proxy.right = functionBinding.path.key as number;
                  }
                  proxy.operator = paramRef.parentPath.node.operator;
                }

                if (paramRef.parentPath?.isCallExpression()) {
                  if (paramRef.key === 'callee') {
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
                proxiesContainer.binaryProxies[keyValue] = proxy;
              }

              if (callProxy.callee !== null) {
                proxiesContainer.callProxies[keyValue] = callProxy;
              }
            } else {
              return false;
            }

            return true;
          })
        ) {
          continue;
        }
        while (path.scope.bindings[name].referenced) {
          const ref = path.scope.bindings[name].referencePaths[0];
          const refExpression = ref.findParent((p) => p.isMemberExpression());
          if (!refExpression?.isMemberExpression()) {
            proxiesContainer.fakeReferences++;
            proxiesContainer.foundReferences++;
            ref.replaceWith(identifier('fakeReference'));
            path.scope.crawl();
            continue;
          }

          const property = refExpression.get('property');
          const propertyString = utils.getPropertyString(property);

          if (!propertyString) {
            proxiesContainer.fakeReferences++;
            proxiesContainer.foundReferences++;
            ref.replaceWith(identifier('fakeReference'));
            path.scope.crawl();
            continue;
          }

          let isRemoved = false;
          if (!proxiesContainer.keys.includes(propertyString)) {
            proxiesContainer.fakeReferences++;
            proxiesContainer.foundReferences++;
            ref.replaceWith(identifier('fakeReference'));
            isRemoved = true;
          } else if (
            refExpression.key === 'callee' &&
            refExpression.parentPath.isCallExpression()
          ) {
            isRemoved =
              removeCallProxy(refExpression.parentPath, proxiesContainer) ??
              false;
          } else {
            isRemoved = removeLiteralProxy(refExpression, proxiesContainer);
          }
          if (!isRemoved) {
            console.log(proxiesContainer);
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
