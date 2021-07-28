import { File } from '@babel/types';
import { utils } from '../common/utils';
import { AnalysisResult } from './types/AnalysisResult';
import { EVALUATE_NUMERIC_EXPRESSIONS } from './visitors/evaluteNumericExpressions';
import { FIND_ARRAY_FUNCTIONS } from './visitors/findArrayFunctions';
import { FIND_STRING_ARRAY } from './visitors/findStringArray';
import { REMOVE_FUNCTION_WRAPPERS } from './visitors/removeFunctionWrappers';
// import { REMOVE_VARIABLE_WRAPPERS } from './visitors/removeVariableWrappers';

export const analyseScript = (ast: File) => {
  const analysisState: AnalysisResult = {
    arrayFunctions: [],
  };
  utils.runVisitors(
    ast,
    analysisState,
    EVALUATE_NUMERIC_EXPRESSIONS,
    FIND_STRING_ARRAY,
    FIND_ARRAY_FUNCTIONS,
    // REMOVE_VARIABLE_WRAPPERS,
    REMOVE_FUNCTION_WRAPPERS,
    EVALUATE_NUMERIC_EXPRESSIONS,
  );
  return utils.regenerate(ast);
};
