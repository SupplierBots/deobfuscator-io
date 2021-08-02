import { File } from '@babel/types';
import { utils } from '../common/utils';
import { StringsDecoder } from './types/StringsDecoder';
import { ObfuscatedStringsState } from './types/ObfuscatedStringsState';
import { EVALUATE_NUMERIC_EXPRESSIONS } from './visitors/evaluteNumericExpressions';
import { FIND_ARRAY_FUNCTIONS } from './visitors/findArrayFunctions';
import { FIND_STRING_ARRAY } from './visitors/findStringArray';
import { REMOVE_FUNCTION_WRAPPERS } from './visitors/removeFunctionWrappers';
import { REMOVE_VARIABLE_WRAPPERS } from './visitors/removeVariableWrappers';
import { REPLACE_CALL_EXPRESSIONS } from './visitors/replaceCallExpressions';
import { UNROTATE_ARRAY } from './visitors/unrotateArray';

export const restoreStrings = (ast: File) => {
  const state: ObfuscatedStringsState = {
    arrayFunctions: {},
  };
  utils.runVisitors(
    ast,
    state,
    EVALUATE_NUMERIC_EXPRESSIONS,
    FIND_STRING_ARRAY,
    FIND_ARRAY_FUNCTIONS,
  );

  if (!state.stringArrayValues) {
    throw new Error('String array values not found!');
  }

  state.decoder = new StringsDecoder(
    state.stringArrayValues,
    state.arrayFunctions,
  );

  utils.runVisitors(
    ast,
    state,
    REMOVE_VARIABLE_WRAPPERS,
    REMOVE_FUNCTION_WRAPPERS,
    // //* Evaluate one more time after functions wrappers are merged
    EVALUATE_NUMERIC_EXPRESSIONS,
    UNROTATE_ARRAY,
    REPLACE_CALL_EXPRESSIONS,
  );

  Object.values(state.arrayFunctions).forEach((fn) => fn.declaration.remove());

  state.stringArrayIdentifier?.getStatementParent()?.remove();

  return utils.regenerate(ast);
};
