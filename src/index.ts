import { GlobalState } from './common/types/GlobalState';
import { utils } from './common/utils';
import { analyseScript } from './scriptAnalysis/analyseScript';

(async () => {
  const start = Date.now();
  const [targetFilename] = process.argv.slice(2);

  const globalState: GlobalState = {};

  const sourceAST = await utils.astFromFile(`fixtures/${targetFilename}.js`);

  const deofbuscatedAST = utils.run(
    sourceAST,
    globalState,
    //* Steps *
    analyseScript,
  );

  await utils.generateOutput(deofbuscatedAST, targetFilename);
  console.log(`Finished in ${Date.now() - start}ms`);
})();
