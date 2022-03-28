import fs from 'fs';
import * as parser from '@babel/parser';
import { Expression, File, Node, PrivateName } from '@babel/types';
import traverse, { NodePath, TraverseOptions } from '@babel/traverse';
import generate from '@babel/generator';
import { DeobfuscatorOperation } from './types/DeobfuscatorOperation';
import { GlobalState } from './types/GlobalState';

export const utils = {
  astFromFile: async (filepath: string) => {
    const code = await fs.promises.readFile(filepath, {
      encoding: 'utf-8',
    });
    const ast = parser.parse(code);
    return ast;
  },
  astFromString: (code: string) => {
    return parser.parse(code);
  },
  runVisitors: <T>(
    ast: Node | Node[],
    state: T,
    ...visitors: TraverseOptions<T>[]
  ): T => {
    for (const visitor of visitors) {
      traverse<T>(ast, visitor, undefined, state);
    }
    return state;
  },
  runPathVisitors: <T>(
    path: NodePath,
    state: T,
    ...visitors: TraverseOptions<T>[]
  ): T => {
    for (const visitor of visitors) {
      path.traverse(visitor, state);
    }
    return state;
  },
  generateOutput: async (ast: File, outputFilename: string) => {
    const { code } = generate(ast, {
      jsescOption: {
        quotes: 'single',
        numbers: 'decimal',
        minimal: true,
      },
    });
    const outDir = './out';
    if (!fs.existsSync(outDir)) {
      await fs.promises.mkdir(outDir);
    }
    await fs.promises.writeFile(
      `${outDir}/${outputFilename}.js`,
      code.replace(/^\s*$(?:\r\n?|\n)/gm, ''),
    );
  },
  regenerate: (ast: File) => {
    return parser.parse(generate(ast).code);
  },
  run: (
    ast: File,
    globalState: GlobalState,
    ...operations: DeobfuscatorOperation[]
  ): File => {
    for (const operation of operations) {
      ast = operation(ast, globalState);
    }
    return ast;
  },
  getPropertyString: (property: NodePath<Expression | PrivateName>) => {
    if (property.isStringLiteral()) {
      return property.node.value;
    }
    if (property.isIdentifier()) {
      return property.node.name;
    }
    throw new Error('Unexpected property type: ' + property.type);
  },
};
