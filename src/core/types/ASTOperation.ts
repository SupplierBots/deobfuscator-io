import { File } from '@babel/types';

export type ASTOperation = (ast: File) => File;
