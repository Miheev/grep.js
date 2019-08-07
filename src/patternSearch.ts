import { map, MapStream, split } from 'event-stream';

import { InputFormatter } from './inputFormatter';
import { EventStreamCallback, GrepLine, IRegExpEngine } from './models';
import { runPipeline } from './pipes/pipeRunner';
import { JsRegExpEngine } from './regExp/JsRegExpEngine';

export class PatternSearch {
  input: InputFormatter;
  regExpEngine: IRegExpEngine;

  constructor(formattedInput: InputFormatter) {
    this.input = formattedInput;

    /**
     * todo: Support additional engines like original grep (e.g. Perl)
     * todo: Add CLI options for additional engines. JS used by default for now
     *
     * @type {IRegExpEngine} Intermediate class for processing RegExp
     */
    this.regExpEngine = new JsRegExpEngine(this.input.keyword);

    this.applyOptions();
  }

  findAll(): MapStream {
    if (!this.input.keyword) {
      return this.currentLines();
    }

    return this.mapLines((lineResult, cb) => {
      if (this.regExpEngine.matchLine(lineResult)) {
        cb(null, lineResult);
      } else {
        cb();
      }
    });
  }

  private applyOptions(): void {
    runPipeline(this.input.pipes.pattern, this.regExpEngine);
    this.regExpEngine.createPattern();
  }

  private mapLines(dataCallback: (line: GrepLine, pipeCallback: EventStreamCallback) => void): MapStream {
    let index = -1;
    return this.input.textStream.pipe(split()).pipe(
      map((line: string, cb: EventStreamCallback) => {
        index++;
        dataCallback({ line, index }, cb);
      }),
    );
  }

  private currentLines(): MapStream {
    return this.mapLines((line, cb) => cb(null, line));
  }
}
