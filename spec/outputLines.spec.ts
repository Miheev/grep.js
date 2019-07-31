import { GrepLine, PipeFunction } from '../src/models';
import { outputLines } from '../src/outputLines';
import { showLineNumber, showMatchCount, showMatchedLineList } from '../src/pipes/renderPipes';

describe('should output results', () => {
  let log = console.log;

  beforeEach(() => {
    spyOn(console, 'log').and.callThrough();
  });

  afterEach(() => {
    console.log = log;
  });

  it('should output with showLineNumber', () => {
    let lines: GrepLine[] = [{ index: 1, line: 'abc' }];
    let pipeline: PipeFunction[] = [showLineNumber as PipeFunction];

    outputLines(lines, pipeline);

    expect(console.log).toHaveBeenCalled();
  });

  it('should not output on empty results', () => {
    let lines: GrepLine[] = [];
    let pipeline: PipeFunction[] = [showLineNumber as PipeFunction];

    outputLines(lines, pipeline);

    expect(console.log).not.toHaveBeenCalled();
  });

  it('should output defaults', () => {
    let lines: GrepLine[] = [
      { index: 1, line: 'abcda Daefg DA', foundIndexList: [[3, 5], [6, 8], [12, 14]] },
      { index: 1, line: 'abcda Daefg DA ', foundIndexList: [[3, 5], [6, 8], [12, 14]] },
    ];
    let pipeline: PipeFunction[] = [showMatchedLineList as PipeFunction];

    outputLines(lines, pipeline);

    expect(console.log).toHaveBeenCalled();
  });

  it('should output matched line count', () => {
    let lines: GrepLine[] = [{ index: 1, line: 'abc' }];
    let pipeline: PipeFunction[] = [showMatchCount as PipeFunction, showLineNumber as PipeFunction];

    outputLines(lines, pipeline);

    expect(console.log).toHaveBeenCalled();
  });
});
