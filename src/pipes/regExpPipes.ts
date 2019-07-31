import { IRegExpEngine } from '../models';

export function caseInsensitiveSearch(regExpEngine: IRegExpEngine, end: () => void): IRegExpEngine {
  regExpEngine.flags.push('i');
  return regExpEngine;
}

export function inverseSearch(regExpEngine: IRegExpEngine, end: () => void): IRegExpEngine {
  regExpEngine.isInverse = true;
  return regExpEngine;
}
