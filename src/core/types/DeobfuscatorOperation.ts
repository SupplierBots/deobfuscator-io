import { File } from '@babel/types';
import { GlobalState } from './GlobalState';

export type DeobfuscatorOperation = (ast: File, state: GlobalState) => File;
