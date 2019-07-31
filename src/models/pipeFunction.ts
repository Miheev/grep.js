export type PipeFunction = (input: unknown, end: () => void) => unknown;

export interface PipeOrderedMap {
  [key: string]: PipeFunction[]
}

export type PipeConfig = [keyof PipeOrderedMap, 'push' | 'unshift', PipeFunction];
