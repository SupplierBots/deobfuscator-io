import { GlobalState } from './common/types/GlobalState';
import { utils } from './common/utils';
import { restoreStrings } from './restoreStrings';
import { removeControlFlowFlattening } from './removeControlFlowFlattening';
import { cleanup } from './cleanup';

(async () => {
  const start = Date.now();
  const [sourceFilename] = process.argv.slice(2);

  const globalState: GlobalState = { placeholder: sourceFilename };

  const sourceAST = await utils.astFromFile(`fixtures/${sourceFilename}.js`);

  const deofbuscatedAST = utils.run(
    sourceAST,
    globalState,
    //* Steps *
    restoreStrings,
    removeControlFlowFlattening,
    cleanup,
  );

  await utils.generateOutput(deofbuscatedAST, sourceFilename);
  console.log(`Finished in ${Date.now() - start}ms`);
})();
