import { NodePath, Visitor } from '@babel/traverse';
import { Scopable } from '@babel/types';
import { utils } from '../../common/utils';
import { BinaryProxy } from '../types/BinaryProxy';
import { CallProxy } from '../types/CallProxy';
import { ProxiesContainer } from '../types/ProxiesContainer';
import { UNWRAP_FUNCTION_PROXIES } from './unwrapFunctionProxies';
import { UNWRAP_STRING_LITERALS } from './unwrapStringLiterals';

type BindingKind = 'var' | 'let' | 'const' | 'hoisted' | 'param';

export const REMOVE_PROXY_CONTAINERS: Visitor = {
  Scopable: function (path: NodePath<Scopable>) {
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
      const init = binding.path.get('init');
      if (!init.isObjectExpression()) continue;

      const proxiesContainer: ProxiesContainer = {
        name,
        stringLiterals: {},
        binaryProxies: {},
        callProxies: {},
        foundReferences: 0,
      };

      const referencesCount = binding.referencePaths.filter((r) => r.node.loc)
        .length;

      if (
        !init.get('properties').every((p) => {
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

          const propertyValue = p.get('value');
          if (propertyValue.isStringLiteral()) {
            proxiesContainer.stringLiterals[keyValue] =
              propertyValue.node.value;
          }

          if (propertyValue.isFunctionExpression()) {
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
              )
                return false;

              const [paramRef] = functionBinding.referencePaths;

              if (paramRef.parentPath?.isBinary()) {
                if (paramRef.key === 'left') {
                  proxy.left = functionBinding.path.key as number;
                } else if (paramRef.key === 'right') {
                  proxy.right = functionBinding.path.key as number;
                }
                proxy.operator = paramRef.parentPath.node.operator;
                continue;
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
          }

          return true;
        })
      )
        continue;

      utils.runPathVisitors(
        path,
        proxiesContainer,
        UNWRAP_STRING_LITERALS,
        UNWRAP_FUNCTION_PROXIES,
      );

      if (referencesCount !== proxiesContainer.foundReferences) {
        throw new Error("Couldn't find all references!");
      }

      binding.path.remove();
    }
  },
};
