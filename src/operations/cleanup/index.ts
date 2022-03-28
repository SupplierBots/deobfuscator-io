import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { REMOVE_DEAD_PATHS } from './visitors/removeDeadPaths';
import { RESTORE_DOT_NOTATION } from './visitors/restoreDotNotation';

export const cleanup = (ast: File) => {
  utils.runVisitors(
    ast,
    {}, //* Empty state
    REMOVE_DEAD_PATHS,
    RESTORE_DOT_NOTATION,
  );
  return ast;
};
