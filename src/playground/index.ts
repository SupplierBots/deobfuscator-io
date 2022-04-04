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
    renameProperties: false,
    renamePropertiesMode: 'safe',
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4', 'none'],
    stringArrayIndexesType: ['hexadecimal-number'],
    rotateStringArray: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    shuffleStringArray: true,
    stringArrayThreshold: 1,
    stringArrayIndexShift: true,
    stringArrayWrappersType: 'function',
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 10,
    splitStrings: true,
    splitStringsChunkLength: 5,
    simplify: true,
    selfDefending: true,
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
