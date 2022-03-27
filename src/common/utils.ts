import fs from 'fs';
import * as parser from '@babel/parser';
import { Expression, File, Node, PrivateName } from '@babel/types';
import traverse, { NodePath, TraverseOptions } from '@babel/traverse';
import generate from '@babel/generator';
import { DeobfuscatorStep } from './types/DeobfuscatorStep';
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
    const { code } = generate(ast);
    const outDir = './out';
    if (!fs.existsSync(outDir)) {
      await fs.promises.mkdir(outDir);
    }
    await fs.promises.writeFile(`${outDir}/${outputFilename}.js`, code);
  },
  regenerate: (ast: File) => {
    return parser.parse(generate(ast).code);
  },
  run: (
    ast: File,
    globalState: GlobalState,
    ...steps: DeobfuscatorStep[]
  ): File => {
    for (const step of steps) {
      ast = step(ast, globalState);
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
