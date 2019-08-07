import { map, MapStream } from 'event-stream';
import { EOL } from 'os';

import { EventStreamCallback, PipeFunction } from './models';
import { runPipeline } from './pipes/pipeRunner';

export function outputLines(stream: MapStream, pipeline: PipeFunction[]): void {
  (runPipeline(pipeline, stream) as MapStream)
    .pipe(
      map((outLine: number | string[], cb: EventStreamCallback) => {
        if (!Array.isArray(outLine)) {
          cb(null, outLine + EOL);
          return;
        }

        cb(null, outLine.join('') + EOL);
      }),
    )
    .pipe(process.stdout);
}
