import { NodePath, Visitor } from '@babel/traverse';
import { NewExpression, StringLiteral } from '@babel/types';
import { removeCustomCodeCall } from '../handlers/removeCustomCodeCall';

export const REMOVE_DOMAIN_LOCK: Visitor = {
  NewExpression(path: NodePath<NewExpression>) {
    const callee = path.get('callee');
    if (!callee.isIdentifier({ name: 'RegExp' })) return;
    const args = path.get('arguments');
    if (args.length !== 2) return;
    const [pattern, flag] = args;
    if (!flag.isStringLiteral({ value: 'g' })) return;
    if (!pattern.isStringLiteral()) return;
    const patternValue = pattern.node.value;
    if (!/^\[.+\]$/.test(patternValue)) return;
    const statement = path.getStatementParent();
    if (!statement?.isVariableDeclaration()) return;
    const nextPath = statement.getNextSibling();
    if (!nextPath?.isVariableDeclaration()) return;

    let matchString;
    try {
      matchString = (nextPath.get(
        'declarations.0.init.callee.object.callee.object',
      ) as NodePath<StringLiteral>).node.value;
    } catch (ex) {
      return;
    }

    const trimmedPattern = patternValue.slice(1, -1);
    let matchingChars = '';
    let i = 0;
    for (const patternChar of trimmedPattern) {
      let stringChar = matchString[i];
      while (patternChar !== stringChar && i < matchString.length) {
        stringChar = matchString[++i];
      }
      if (patternChar === stringChar) {
        matchingChars += patternChar;
      }
    }
    if (matchingChars !== trimmedPattern) return;

    const lockFunction = statement.getFunctionParent();
    if (!lockFunction?.isFunctionParent()) return;
    removeCustomCodeCall(lockFunction);
  },
};
