import ReadStream = NodeJS.ReadStream;
import { createReadStream } from "fs";
import { InputFormatter } from '../src/inputFormatter';
import { PatternSearch } from '../src/patternSearch';
import { caseInsensitiveSearch, inverseSearch } from '../src/pipes/regExpPipes';
import { GrepLine, PipeFuntion } from '../src/models';

const filePath = './spec/helpers/test-file.txt';

describe('should search by provided pattern', () => {
  let exitFn = () => undefined;
  let argv: string[] = [];
  let stream: ReadStream;
  let input: InputFormatter;
  let object: PatternSearch;

  beforeEach(() => {
    stream = createReadStream(filePath) as unknown as ReadStream;
    input = new InputFormatter(argv, stream, exitFn);
  });

  it('should init', () => {
    object = new PatternSearch(input);

    expect(object).toBeTruthy();
    expect(object.regExpEngine.flags.length).toBe(1);
    expect(object.regExpEngine.isInverse).toBe(false);
  });

  it('should init with pipes', () => {
    input.pipes.pattern = [caseInsensitiveSearch as PipeFuntion, inverseSearch as PipeFuntion];

    object = new PatternSearch(input);

    expect(object.regExpEngine.flags.length).toBe(2);
    expect(object.regExpEngine.isInverse).toBe(true);
  });

  it('should find matches', () => {
    input.keyword = 'No';
    input.textLines = ['No ', 'Yes', 'xx No'];

    object = new PatternSearch(input);
    let results: GrepLine[] = object.findAll();

    expect(results.length).toBe(2);
  });

  it('should find matches inverted and case-insensitive', () => {
    input.keyword = 'No';
    input.textLines = ['No ', 'Yes', 'xx no'];
    input.pipes.pattern = [caseInsensitiveSearch as PipeFuntion, inverseSearch as PipeFuntion];

    object = new PatternSearch(input);
    let results: GrepLine[] = object.findAll();

    expect(results.length).toBe(1);
  });

  it('should return all if keyword not defined', () => {
    input.textLines = ['No ', 'Yes', 'xx No'];

    object = new PatternSearch(input);
    let results: GrepLine[] = object.findAll();

    expect(results.length).toBe(3);
  });
});
