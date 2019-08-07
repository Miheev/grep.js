import { join, map, readArray } from 'event-stream';
import { createReadStream } from 'fs';
import ReadableStream = NodeJS.ReadableStream;

import { EventStreamCallback, GrepLine } from '../src/models';
import { InputFormatter } from '../src/inputFormatter';
import { PipeFunction } from '../src/models';
import { PatternSearch } from '../src/patternSearch';
import { caseInsensitiveSearch, inverseSearch } from '../src/pipes/regExpPipes';

const filePath = './spec/helpers/test-file.txt';

describe('should search by provided pattern', () => {
  let exitFn = () => undefined;
  let argv: string[] = [];
  let stream: ReadableStream;
  let input: InputFormatter;
  let object: PatternSearch;

  beforeEach(() => {
    stream = createReadStream(filePath);
    input = new InputFormatter(argv, stream, exitFn);
  });

  it('should init', () => {
    object = new PatternSearch(input);

    expect(object).toBeTruthy();
    expect(object.regExpEngine.flags.length).toBe(1);
    expect(object.regExpEngine.isInverse).toBe(false);
  });

  it('should init with pipes', () => {
    input.pipes.pattern = [caseInsensitiveSearch as PipeFunction, inverseSearch as PipeFunction];

    object = new PatternSearch(input);

    expect(object.regExpEngine.flags.length).toBe(2);
    expect(object.regExpEngine.isInverse).toBe(true);
  });

  it('should find matches', (itCallback) => {
    input.keyword = 'No';
    input.textStream = readArray(['No ', 'Yes', 'xx No']).pipe(join('\n')) as unknown as ReadableStream;

    object = new PatternSearch(input);
    let counter = 0;

    object.findAll().pipe(map((line: GrepLine, cb: EventStreamCallback) => {
      counter++;
      cb(null, line);
    })).on('end', () => {
      expect(counter).toBe(2);
      itCallback();
    });
  });

  it('should find matches inverted and case-insensitive', (itCallback) => {
    input.keyword = 'No';
    input.textStream = readArray(['No ', 'Yes', 'xx no']).pipe(join('\n')) as unknown as ReadableStream;
    input.pipes.pattern = [caseInsensitiveSearch as PipeFunction, inverseSearch as PipeFunction];

    object = new PatternSearch(input);
    let counter = 0;

    object.findAll().pipe(map((line: GrepLine, cb: EventStreamCallback) => {
      counter++;
      cb(null, line);
    })).on('end', () => {
      expect(counter).toBe(1);
      itCallback();
    });
  });

  it('should return all if keyword not defined', (itCallback) => {
    input.textStream = readArray(['No ', 'Yes', 'xx No']).pipe(join('\n')) as unknown as ReadableStream;

    object = new PatternSearch(input);
    let counter = 0;

    object.findAll().pipe(map((line: GrepLine, cb: EventStreamCallback) => {
      counter++;
      cb(null, line);
    })).on('end', () => {
      expect(counter).toBe(3);
      itCallback();
    });
  });
});
