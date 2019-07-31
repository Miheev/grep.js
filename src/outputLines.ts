import { GrepLine, PipeFunction } from './models';
import { runPipeline } from './pipes/pipeRunner';

export function outputLines(lineList: GrepLine[], pipeline: PipeFunction[]): void {
  const outLines: number | string[][] = runPipeline(pipeline, lineList) as number | string[][];

  if (!Array.isArray(outLines)) {
    console.log(outLines);
    return;
  }

  outLines.forEach((lineItem) => {
    console.log(lineItem.join(''));
  });
}
