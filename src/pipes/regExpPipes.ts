import { GrepLine, IRegExpEngine } from '../models';

export function caseInsensitiveSearch(regExpEngine: IRegExpEngine, end: () => void): IRegExpEngine {
  regExpEngine.flags.push('i');
  return regExpEngine;
}

export function inverseSearch(regExpEngine: IRegExpEngine, end: () => void): IRegExpEngine {
  regExpEngine.isInverse = true;
  return regExpEngine;
}

export function showMatchCount(resultList: GrepLine[], end: () => void): number {
  end();
  return resultList.length;
}

