import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { REMOVE_DEAD_PATHS } from './visitors/removeDeadPaths';
import { RESTORE_DOT_NOTATION } from './visitors/restoreDotNotation';
import { UNWRAP_EXPRESSIONS } from './visitors/unwrapExpressions';
import { UNWRAP_VARIABLE_DECLARATORS } from './visitors/unwrapVariableDeclarators';

export const cleanup = (ast: File) => {
  utils.runVisitors(
    ast,
    {}, //* Empty state
    REMOVE_DEAD_PATHS,
    UNWRAP_EXPRESSIONS,
    UNWRAP_VARIABLE_DECLARATORS,
    RESTORE_DOT_NOTATION,
  );
  return ast;
};
