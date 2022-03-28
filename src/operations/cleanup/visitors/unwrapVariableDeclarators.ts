import { NodePath, Visitor } from '@babel/traverse';
import { variableDeclaration, VariableDeclaration } from '@babel/types';

export const UNWRAP_VARIABLE_DECLARATORS: Visitor = {
  VariableDeclaration: function (path: NodePath<VariableDeclaration>) {
    const kind = path.node.kind;
    const declarators = path.get('declarations');
    if (declarators.length < 2) return;
    const declarations = declarators.map((d) =>
      variableDeclaration(kind, [d.node]),
    );
    path.replaceWithMultiple(declarations);
  },
};
