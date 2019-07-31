import { PipeFunction } from '../models';

export function runPipeline(pipeList: Array<PipeFunction>, params: unknown): unknown {
  let isFinished = false;

  function end(): void {
    isFinished = true;
  }

  let pipeIndex = 0;
  let result = params;
  while (pipeIndex < pipeList.length && !isFinished) {
    result = pipeList[pipeIndex](result, end);
    pipeIndex += 1;
  }

  return result;
}
