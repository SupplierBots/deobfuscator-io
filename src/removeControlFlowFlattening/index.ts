import { File } from '@babel/types';
import { utils } from '../common/utils';
import { RESTORE_OBJECT_EXPRESSIONS } from './visitors/restoreObjectExpressions';

export const removeControlFlowFlattening = (ast: File) => {
  const state = {
    arrayFunctions: {},
  };
  utils.runVisitors(ast, state, RESTORE_OBJECT_EXPRESSIONS);

  return ast;
};
