import { NodePath, Visitor } from '@babel/traverse';
import { ArrayExpression } from '@babel/types';
import { PathKey } from '@core/types/PathKey';
import { PathListKey } from '@core/types/PathListKey';
import { ObfuscatedStringsState } from '../types/ObfuscatedStringsState';

export const FIND_STRING_ARRAY: Visitor<ObfuscatedStringsState> = {
  ArrayExpression: function (
    path: NodePath<ArrayExpression>,
    state: ObfuscatedStringsState,
  ) {
    const elements = path.get(PathListKey.Elements);
    if (elements.some((e) => !e.isStringLiteral())) return;

    const container = path.getStatementParent()?.parentPath;
    if (container?.isProgram()) {
      const parent = path.parentPath;
      if (!parent.isVariableDeclarator()) return;
      const declaration = parent.parentPath;
      if (!declaration.isVariableDeclaration()) return;

      const id = parent.get(PathKey.Id);
      if (!id.isIdentifier()) return;

      state.arrayDeclaration = declaration;
      state.arrayIdentifier = id;
    } else if (container?.isBlockStatement()) {
      if (container.node.body.length !== 3) return;
      const declaration = container.parentPath;
      if (!declaration.isFunctionDeclaration()) return;
      if (!declaration.parentPath.isProgram()) return;
      const id = declaration.get(PathKey.Id);
      if (!id.isIdentifier()) return;
      state.arrayDeclaration = declaration;
      state.arrayIdentifier = id;
    } else {
      return;
    }

    state.arrayBinding = path.findBinding(state.arrayIdentifier.node.name);
    state.arrayValues = elements
      .map((e) => {
        if (!e.isStringLiteral()) return '';
        return e.node.value;
      })
      .filter(Boolean);
    path.stop();
  },
};
