import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { RESTORE_DOT_NOTATION } from './visitors/restoreDotNotation';

export const cleanup = (ast: File) => {
  utils.runVisitors(
    ast,
    {}, //* Empty state
    RESTORE_DOT_NOTATION,
  );
  return ast;
};
