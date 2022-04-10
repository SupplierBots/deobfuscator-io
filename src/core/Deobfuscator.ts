import * as parser from '@babel/parser';
import generate from '@babel/generator';

import {
  restoreStrings,
  restoreFlow,
  cleanup,
  removeCustomCode,
} from 'operations';
import { ASTOperation } from './types/ASTOperation';
import { File } from '@babel/types';

export class Deobfuscator {
  public static deobfuscate(sourceCode: string): string {
    const sourceAST = parser.parse(sourceCode);

    const deofbuscatedAST = Deobfuscator.run(
      sourceAST,
      //* Operations *
      restoreStrings,
      restoreFlow,
      cleanup,
      removeCustomCode,
    );

    const { code } = generate(deofbuscatedAST, {
      jsescOption: {
        quotes: 'single',
        numbers: 'decimal',
        minimal: true,
      },
    });
    return code.replace(/^\s*$(?:\r\n?|\n)/gm, '');
  }

  private static run(ast: File, ...operations: ASTOperation[]): File {
    for (const operation of operations) {
      ast = operation(ast);
    }
    return ast;
  }
}
