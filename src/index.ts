import { GlobalState } from './core/types/GlobalState';
import { utils } from './core/utils';
import { restoreStrings } from './operations/restoreStrings';
import { restoreFlow } from './operations/restoreFlow';
import { cleanup } from './operations/cleanup';

import '@core/pathExtensions';
import '@core/scopeExtensions';

(async () => {
  const start = Date.now();
  const [sourceFilename] = process.argv.slice(2);

  const globalState: GlobalState = { placeholder: sourceFilename };

  const sourceAST = await utils.astFromFile(`fixtures/${sourceFilename}.js`);

  const deofbuscatedAST = utils.run(
    sourceAST,
    globalState,
    //* Operations *
    restoreStrings,
    restoreFlow,
    cleanup,
  );

  await utils.generateOutput(deofbuscatedAST, sourceFilename);
  console.log(`Finished in ${Date.now() - start}ms`);
})();
