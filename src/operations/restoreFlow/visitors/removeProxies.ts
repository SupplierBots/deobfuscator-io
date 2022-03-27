import { NodePath, Visitor } from '@babel/traverse';
import { cloneDeepWithoutLoc, MemberExpression, Scopable } from '@babel/types';
import { ExtendedScope } from '../../../core/types/ExtendedScope';
import { BinaryProxy } from '../types/BinaryProxy';
import { CallProxy } from '../types/CallProxy';
import { ProxiesContainer } from '../types/ProxiesContainer';
import { utils } from '../../../core/utils';
import { UNWRAP_STRING_LITERALS } from './unwrapStringLiterals';
import { UNWRAP_FUNCTION_PROXIES } from './unwrapFunctionProxies';

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
        const references = binding.referencePaths
          .filter((r) => r.node.loc)
          .map((r) => r.findParent((p) => p.isMemberExpression()))
          .filter(Boolean) as NodePath<MemberExpression>[];

        const proxiesContainer: ProxiesContainer = {
          name,
          keys: [],
          stringLiterals: {},
          binaryProxies: {},
          callProxies: {},
          memberExpressionProxies: {},
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

            if (propertyValue.isStringLiteral()) {
              proxiesContainer.stringLiterals[keyValue] =
                propertyValue.node.value;
            }

            if (propertyValue.isMemberExpression()) {
              proxiesContainer.memberExpressionProxies[
                keyValue
              ] = cloneDeepWithoutLoc(propertyValue.node);
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
        ) {
          continue;
        }

        references.forEach((ref) => {
          const property = ref.get('property');
          const propertyString = utils.getPropertyString(property);
          if (!proxiesContainer.keys.includes(propertyString)) {
            proxiesContainer.fakeReferences++;
            proxiesContainer.foundReferences++;
          }
        });

        utils.runPathVisitors(
          path,
          proxiesContainer,
          UNWRAP_STRING_LITERALS,
          UNWRAP_FUNCTION_PROXIES,
        );

        if (referencesCount !== proxiesContainer.foundReferences) {
          console.log(proxiesContainer);
          console.log(path.toString());
          throw new Error(`Couldn't find all references! ${name}`);
        } else {
          binding.path.remove();
        }
      }
    },
  },
};
