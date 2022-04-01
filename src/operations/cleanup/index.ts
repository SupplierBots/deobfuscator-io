import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { ADD_MISSING_BLOCK_STATEMENTS } from './visitors/addMissingBlockStatements';
import { REMOVE_CALL_WRAPPERS } from './visitors/removeCallWrappers';
import { REMOVE_DEAD_PATHS } from './visitors/removeDeadPaths';
import { REMOVE_DEBUG_PROTECTION } from './visitors/removeDebugProtection';
import { REMOVE_DOMAIN_LOCK } from './visitors/removeDomainLock';
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
    ADD_MISSING_BLOCK_STATEMENTS,
    RESTORE_DOT_NOTATION,
    REMOVE_DOMAIN_LOCK,
    REMOVE_DEBUG_PROTECTION,
    REMOVE_CALL_WRAPPERS,
  );
  return ast;
};
