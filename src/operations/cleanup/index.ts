import { File } from '@babel/types';
import { traverseUtils } from '../../core/traverseUtils';
import { ADD_MISSING_BLOCK_STATEMENTS } from './visitors/addMissingBlockStatements';
import { RENAME_IDENTIFIERS } from './visitors/renameIdentifiers';
import { RESTORE_DOT_NOTATION } from './visitors/restoreDotNotation';
import { UNWRAP_EXPRESSIONS } from './visitors/unwrapExpressions';
import { UNWRAP_VARIABLE_DECLARATORS } from './visitors/unwrapVariableDeclarators';

export const cleanup = (ast: File) => {
  traverseUtils.runVisitors(
    ast,
    {}, //* Empty state
    UNWRAP_EXPRESSIONS,
    UNWRAP_VARIABLE_DECLARATORS,
    ADD_MISSING_BLOCK_STATEMENTS,
    RENAME_IDENTIFIERS,
    RESTORE_DOT_NOTATION,
  );
  return ast;
};
