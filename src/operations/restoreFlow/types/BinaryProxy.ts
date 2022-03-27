import { BinaryOperator } from './BinaryOperator';

export interface BinaryProxy {
  operator: BinaryOperator | null;
  left: number | null;
  right: number | null;
}
