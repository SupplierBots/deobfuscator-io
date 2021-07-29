import { NodePath, Visitor } from '@babel/traverse';
import { CallExpression, stringLiteral } from '@babel/types';
import { AnalysisResult } from '../types/AnalysisResult';

export const REPLACE_CALL_EXPRESSIONS: Visitor<AnalysisResult> = {
  CallExpression(path: NodePath<CallExpression>, state: AnalysisResult) {
    const callee = path.get('callee');
    if (
      !callee.isIdentifier() ||
      !state.decoder?.isDecoderFunction(callee.node.name)
    ) {
      return;
    }

    const functionParent = path.getFunctionParent();
    if (functionParent?.isFunctionDeclaration()) {
      const id = functionParent.get('id');
      if (id.isIdentifier() && state.decoder.isDecoderFunction(id.node.name)) {
        return; //* Call expression is from declaration's return statement
      }
    }

    const [first, second] = path.get('arguments');
    if (!first.isStringLiteral() && !first.isNumericLiteral()) {
      throw new Error("Unexpected first array function's argument");
    }

    if (second && !second.isStringLiteral() && !second.isNumericLiteral()) {
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
