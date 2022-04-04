import { File } from '@babel/types';
import { utils } from '../../core/utils';
import { StringsDecoder } from './types/StringsDecoder';
import { ObfuscatedStringsState } from './types/ObfuscatedStringsState';
import { SIMPLIFY_EXPRESSIONS } from './visitors/simplifyExpressions';
import { FIND_STRING_ARRAY } from './visitors/findStringArray';
import { REMOVE_FUNCTION_WRAPPERS } from './visitors/removeFunctionWrappers';
import { REMOVE_VARIABLE_WRAPPERS } from './visitors/removeVariableWrappers';
import { UNROTATE_ARRAY } from './visitors/unrotateArray';
import { UNESCAPE_UNICODE_SEQUENCES } from './visitors/unescapeUnicodeSequences';
import { REPLACE_CALL_EXPRESSIONS } from './visitors/replaceCallExpressions';
import { findArrayGetters } from './handlers/findArrayGetters';

export const restoreStrings = (ast: File) => {
  const state: ObfuscatedStringsState = {
    getters: {},
  };

  utils.runVisitors(
    ast,
    state,
    SIMPLIFY_EXPRESSIONS, //* Evaluate numeric expressions
    UNESCAPE_UNICODE_SEQUENCES,
    FIND_STRING_ARRAY,
  );

  if (!state.arrayValues) {
    console.warn('String array values not found!');
    return ast;
  }

  findArrayGetters(state);
  state.decoder = new StringsDecoder(state.arrayValues, state.getters);

  utils.runVisitors(
    ast,
    state,
    REMOVE_VARIABLE_WRAPPERS,
    REMOVE_FUNCTION_WRAPPERS,
    SIMPLIFY_EXPRESSIONS, //* Add functions wrappers' offsets after they are merged
    UNROTATE_ARRAY,
    REPLACE_CALL_EXPRESSIONS,
    SIMPLIFY_EXPRESSIONS, //* Merge strings
  );

  //* Remove wrappers & string array
  Object.values(state.getters).forEach((fn) => fn.declaration.remove());
  state.arrayDeclaration?.remove();

  return ast;
};
