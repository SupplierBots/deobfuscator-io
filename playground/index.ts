import path from 'path';
import fs from 'fs/promises';
import JavascriptObfuscator from 'javascript-obfuscator';
(async () => {
  const input = await fs.readFile(
    path.resolve(__dirname, 'files', 'input.js'),
    { encoding: 'utf-8' },
  );
  const obfuscationResult = JavascriptObfuscator.obfuscate(input, {
    compact: false,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 1,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    domainLock: [],
    domainLockRedirectUrl: 'about:blank',
    identifierNamesGenerator: 'mangled-shuffled',
    numbersToExpressions: false,
    renameGlobals: false,
    renameProperties: false,
    renamePropertiesMode: 'safe',
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4', 'none'],
    stringArrayIndexesType: ['hexadecimal-number'],
    rotateStringArray: true,
    shuffleStringArray: true,
    stringArrayThreshold: 1,
    stringArrayIndexShift: true,
    stringArrayWrappersType: 'function',
    stringArrayWrappersCount: 3,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    splitStrings: false,
    splitStringsChunkLength: 10,
    simplify: true,
    selfDefending: false,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    target: 'browser',
    seed: 2137,
  });
  await fs.writeFile(
    path.resolve(__dirname, 'files', 'output.js'),
    obfuscationResult.getObfuscatedCode(),
    { encoding: 'utf-8' },
  );
})();
