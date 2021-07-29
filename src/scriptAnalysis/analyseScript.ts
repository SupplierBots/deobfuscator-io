import { File } from '@babel/types';
import { utils } from '../common/utils';
import { StringsDecoder } from './StringsDecoder';
import { AnalysisResult } from './types/AnalysisResult';
import { EVALUATE_NUMERIC_EXPRESSIONS } from './visitors/evaluteNumericExpressions';
import { FIND_ARRAY_FUNCTIONS } from './visitors/findArrayFunctions';
import { FIND_STRING_ARRAY } from './visitors/findStringArray';
import { REMOVE_FUNCTION_WRAPPERS } from './visitors/removeFunctionWrappers';
import { REMOVE_VARIABLE_WRAPPERS } from './visitors/removeVariableWrappers';
import { REPLACE_CALL_EXPRESSIONS } from './visitors/replaceCallExpressions';
import { UNROTATE_ARRAY } from './visitors/unrotateArray';

export const analyseScript = (ast: File) => {
  const analysisState: AnalysisResult = {
    arrayFunctions: {},
  };
  utils.runVisitors(
    ast,
    analysisState,
    EVALUATE_NUMERIC_EXPRESSIONS,
    FIND_STRING_ARRAY,
    FIND_ARRAY_FUNCTIONS,
  );

  if (!analysisState.stringArrayValues) {
    throw new Error('String array values not found!');
  }

  analysisState.decoder = new StringsDecoder(
    analysisState.stringArrayValues,
    analysisState.arrayFunctions,
  );

  utils.runVisitors(
    ast,
    analysisState,
    REMOVE_VARIABLE_WRAPPERS,
    REMOVE_FUNCTION_WRAPPERS,
    // //* Evaluate one more time after functions wrappers are merged
    EVALUATE_NUMERIC_EXPRESSIONS,
    UNROTATE_ARRAY,
    REPLACE_CALL_EXPRESSIONS,
  );

  Object.values(analysisState.arrayFunctions).forEach((fn) =>
    fn.declaration.remove(),
  );

  analysisState.stringArrayIdentifier?.getStatementParent()?.remove();

  return utils.regenerate(ast);
};
