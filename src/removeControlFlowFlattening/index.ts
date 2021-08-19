import { File } from '@babel/types';
import { utils } from '../common/utils';
import { RESTORE_OBJECT_EXPRESSIONS } from './visitors/restoreObjectExpressions';
import { REMOVE_PROXY_CONTAINERS } from './visitors/removeProxyContainers';

export const removeControlFlowFlattening = (ast: File) => {
  const state = {
    arrayFunctions: {},
  };
  utils.runVisitors(
    ast,
    state,
    RESTORE_OBJECT_EXPRESSIONS,
    REMOVE_PROXY_CONTAINERS,
  );

  return ast;
};
