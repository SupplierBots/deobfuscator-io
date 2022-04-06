import path from 'path';
import fs from 'fs/promises';
import { obfuscate } from 'javascript-obfuscator';
(async () => {
  const input = await fs.readFile(
    path.resolve(__dirname, 'files', 'input.js'),
    { encoding: 'utf-8' },
  );

  const obfuscationResult = obfuscate(input, {
    compact: false,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    domainLock: ['test.com'],
    domainLockRedirectUrl: 'about:blank',
    identifierNamesGenerator: 'hexadecimal',
    numbersToExpressions: true,
    renameGlobals: false,
    renameProperties: true,
    renamePropertiesMode: 'safe',
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4', 'none'],
    stringArrayIndexesType: ['hexadecimal-number'],
    rotateStringArray: true,
    shuffleStringArray: true,
    stringArrayThreshold: 1,
    stringArrayIndexShift: true,
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    simplify: true,
    selfDefending: true,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    stringArrayWrappersType: 'function', //* >= 2.16.0
    stringArrayWrappersParametersMaxCount: 10, //* >= 2.16.0
    stringArrayRotate: true, //* >= 3.0.0
    stringArrayShuffle: true, //* >= 3.0.0
    stringArrayCallsTransform: true, //* >= 3.2.0
    stringArrayCallsTransformThreshold: 1, //* >= 3.2.0
    target: 'browser',
    seed: 2137,
  });

  await fs.writeFile(
    path.resolve(__dirname, 'files', 'output.js'),
    obfuscationResult.getObfuscatedCode(),
    { encoding: 'utf-8' },
  );
})();
