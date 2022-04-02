import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { RESTORE_OBJECT_EXPRESSIONS } from './visitors/restoreObjectExpressions';
import { REMOVE_PROXIES } from './visitors/removeProxies';
import { REMOVE_SWITCH_STATEMENTS } from './visitors/removeSwitchStatements';
import { REMOVE_DEAD_PATHS } from './visitors/removeDeadPaths';

export const restoreFlow = (ast: File) => {
  utils.runVisitors(
    ast,
    {}, //* Empty state
    RESTORE_OBJECT_EXPRESSIONS,
    REMOVE_PROXIES,
    REMOVE_SWITCH_STATEMENTS,
    REMOVE_DEAD_PATHS,
  );
  return ast;
};
