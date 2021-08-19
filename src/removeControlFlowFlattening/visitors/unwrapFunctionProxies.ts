import { NodePath, Visitor } from '@babel/traverse';
import {
  binaryExpression,
  callExpression,
  CallExpression,
  cloneDeepWithoutLoc,
  Expression,
  logicalExpression,
} from '@babel/types';
import { ProxiesContainer } from '../types/ProxiesContainer';

export const UNWRAP_FUNCTION_PROXIES: Visitor<ProxiesContainer> = {
  CallExpression(
    path: NodePath<CallExpression>,
    proxiesContainer: ProxiesContainer,
  ) {
    const callee = path.get('callee');
    if (!callee.isMemberExpression()) return;

    const object = callee.get('object');
    if (!object.isIdentifier()) return;
    const objectName = object.node.name;
    if (objectName !== proxiesContainer.name) return;

    const { binaryProxies, callProxies } = proxiesContainer;

    const property = callee.get('property');
    if (!property.isStringLiteral()) return;

    const propertyName = property.node.value;
    const args = path.get('arguments');

    if (propertyName in binaryProxies) {
      if (args.length !== 2) {
        throw new Error('Unexpected arguments amount');
      }

      const proxy = binaryProxies[propertyName];

      if (
        proxy.operator === null ||
        proxy.left === null ||
        proxy.right === null
      )
        return;

      const leftArg = args[proxy.left];
      if (!leftArg.isExpression()) {
        throw new Error(`Unexpected left argument type: ${leftArg.type}`);
      }

      const rightArg = args[proxy.right];
      if (!rightArg.isExpression()) {
        throw new Error(`Unexpected right argument type: ${rightArg.type}`);
      }

      const binaryReplacement =
        proxy.operator === '||' ||
        proxy.operator === '&&' ||
        proxy.operator === '??'
          ? logicalExpression(
              proxy.operator,
              cloneDeepWithoutLoc(leftArg.node),
              cloneDeepWithoutLoc(rightArg.node),
            )
          : binaryExpression(
              proxy.operator,
              cloneDeepWithoutLoc(leftArg.node),
              cloneDeepWithoutLoc(rightArg.node),
            );
      path.replaceWith(binaryReplacement);
      path.scope.crawl();
      proxiesContainer.foundReferences++;
      return;
    }

    if (propertyName in callProxies) {
      const proxy = callProxies[propertyName];

      if (proxy.callee === null) return;

      if (args.length !== proxy.params.length + 1) {
        throw new Error('Unexpected params length');
      }

      const callee = args[proxy.callee];
      if (!callee.isExpression()) {
        throw new Error(`Unexpected callee type: ${callee.type}`);
      }

      const parsedArgs: Expression[] = [];
      proxy.params.forEach((p) => {
        const arg = args[p.functionIndex];
        if (!arg.isExpression()) {
          throw new Error(`Unexpected argument type: ${arg.type}`);
        }
        parsedArgs[p.targetIndex] = cloneDeepWithoutLoc(arg.node);
      });

      if (Object.values(parsedArgs).length !== parsedArgs.length) {
        throw new Error('Parsed args array has empty slots!');
      }

      const callReplacement = callExpression(
        cloneDeepWithoutLoc(callee.node),
        parsedArgs,
      );

      path.replaceWith(callReplacement);
      path.scope.crawl();
      proxiesContainer.foundReferences++;
    }
  },
};
