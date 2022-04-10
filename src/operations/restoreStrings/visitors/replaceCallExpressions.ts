import { NodePath, Visitor } from '@babel/traverse';
import { CallExpression, stringLiteral } from '@babel/types';
import { pathUtils } from 'core';
import { PathKey, PathListKey, ExtendedScope } from 'core/types';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

export const REPLACE_CALL_EXPRESSIONS: Visitor<ObfuscatedStringsState> = {
  CallExpression(
    path: NodePath<CallExpression>,
    state: ObfuscatedStringsState,
  ) {
    const callee = path.get(PathKey.Callee);
    if (
      !callee.isIdentifier() ||
      !state.decoder?.isDecoderFunction(callee.node.name)
    ) {
      return;
    }

    const functionParent = path.getFunctionParent();
    if (functionParent?.isFunctionDeclaration()) {
      const id = functionParent.get(PathKey.Id);
      if (id.isIdentifier() && state.decoder.isDecoderFunction(id.node.name)) {
        return; //* Call expression is from declaration's return statement
      }
    }

    const [first, second] = path.get(PathListKey.Arguments);

    if (!first.isStringLiteral() && !first.isNumericLiteral()) {
      const bindingUid = (pathUtils.findBinding(path, callee.node.name)
        ?.scope as ExtendedScope).uid;
      if (bindingUid !== (state.arrayBinding?.scope as ExtendedScope).uid)
        return;
      throw new Error("Unexpected first array function's argument");
    }

    if (second && !second.isStringLiteral() && !second.isNumericLiteral()) {
      const bindingUid = (pathUtils.findBinding(path, callee.node.name)
        ?.scope as ExtendedScope).uid;
      if (bindingUid !== (state.arrayBinding?.scope as ExtendedScope).uid)
        return;
      throw new Error("Unexpected second array function's argument");
    }

    const index = parseInt(first.node.value as string);
    const key = second?.node.value;
    const decodedString =
      typeof key === 'string'
        ? state.decoder.decode(callee.node.name, index, key)
        : state.decoder.decode(callee.node.name, index);
    path.replaceWith(stringLiteral(decodedString));
  },
};
