import { InputFormatter } from './inputFormatter';
import { GrepLine, IRegExpEngine } from './models';
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

  findAll(): GrepLine[] {
    if (!this.input.keyword) {
      return this.currentLines();
    }

    let lineResult;
    return this.input.textLines.reduce((resultList, line, index) => {
      lineResult = { line, index };
      if (this.regExpEngine.matchLine(lineResult)) {
        resultList.push(lineResult);
      }
      return resultList;
    }, [] as GrepLine[]);
  }

  private applyOptions(): void {
    runPipeline(this.input.pipes.pattern, this.regExpEngine);
    this.regExpEngine.createPattern();
  }

  private currentLines(): GrepLine[] {
    return this.input.textLines.map((line, index) => {
      return { line, index };
    });
  }
}
