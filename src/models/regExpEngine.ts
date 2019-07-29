import { GrepLine } from './index';

export interface IRegExpEngine {
  isInverse: boolean;
  flags: string[];

  createPattern(): void;

  matchLine(searchItem: GrepLine): GrepLine | boolean;
}
