import { NodePath, Visitor } from '@babel/traverse';
import { cloneDeepWithoutLoc, Node, StringLiteral } from '@babel/types';
import { PathKey, PathListKey } from 'core/types';

export const REMOVE_SWITCH_STATEMENTS: Visitor = {
  StringLiteral: {
    exit(path: NodePath<StringLiteral>) {
      const value = path.node.value;
      if (!/^[\d|]+\d$/.test(value)) return;
      const parent = path.parentPath;
      if (!parent.isMemberExpression()) return;
      const property = parent.get(PathKey.Property);
      if (property.isStringLiteral() && property.node.value !== 'split') return;
      if (property.isIdentifier() && property.node.name !== 'split') return;

      const orderDeclaration = path.getStatementParent();
      if (!orderDeclaration) return;

      const sibling = orderDeclaration
        .getAllNextSiblings()
        .find((s) => s.isWhileStatement());

      if (!sibling?.isWhileStatement()) return;
      const loopCondition = sibling.get(PathKey.Test);
      if (!loopCondition.isBooleanLiteral({ value: true })) return;
      const loopBody = sibling.get(PathKey.Body);
      if (!loopBody.isBlockStatement()) return;
      const [bodyStatement] = loopBody.get(PathListKey.Body);
      if (!bodyStatement.isSwitchStatement()) return;

      const discriminant = bodyStatement.get(PathKey.Discriminant);
      if (!discriminant.isMemberExpression()) return;
      const object = discriminant.get(PathKey.Object);
      if (!object.isIdentifier()) return;
      const discriminantProperty = discriminant.get(PathKey.Property);
      if (!discriminantProperty.isUpdateExpression({ operator: '++' })) return;

      const updateArgument = discriminantProperty.get(PathKey.Argument);
      if (!updateArgument.isIdentifier()) return;

      const orderStringName = object.node.name;
      const orderIncrementName = updateArgument.node.name;

      const functionParent = path.getFunctionParent();
      if (!functionParent) return;

      const orderStringBinding = functionParent.scope.bindings[orderStringName];
      if (!orderStringBinding) return;

      const orderIncrementBinding =
        functionParent.scope.bindings[orderIncrementName];
      if (!orderIncrementBinding) return;

      const casesOrder = value.split('|');
      const cases = bodyStatement
        .get(PathListKey.Cases)
        .reduce((casesObject: { [key: string]: Node[] }, caseStatement) => {
          const label = caseStatement.get(PathKey.Test);
          if (!label.isStringLiteral()) {
            throw new Error('Unexpected case label');
          }
          const caseBody = caseStatement
            .get(PathKey.Consequent)
            .filter((p) => !p.isContinueStatement())
            .map((p) => cloneDeepWithoutLoc(p.node));
          casesObject[label.node.value] = caseBody;
          return casesObject;
        }, {});
      const resultNodes = casesOrder.reduce((nodesArray: Node[], caseOrder) => {
        return [...nodesArray, ...cases[caseOrder]];
      }, []);
      sibling.replaceWithMultiple(resultNodes);
      sibling.getFunctionParent()?.scope.crawl();
      orderStringBinding.path.remove();
      orderIncrementBinding.path.remove();
    },
  },
};
