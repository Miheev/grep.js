export type PipeFuntion = (input: unknown, end: () => void) => unknown;

export type PipeConfig = [keyof PipeOrderedMap, 'push' | 'unshift', PipeFuntion];

export interface PipeOrderedMap {
  [key: string]: PipeFuntion[]
}
