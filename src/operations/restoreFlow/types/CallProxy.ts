export interface CallProxy {
  callee: number | null;
  params: { functionIndex: number; targetIndex: number }[];
}
