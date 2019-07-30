import { createReadStream } from 'fs';
import { InputFormatter } from '../src/inputFormatter';
import Spy = jasmine.Spy;
import ReadStream = NodeJS.ReadStream;

const filePath = './spec/helpers/test-file.txt';

describe('should format input before search will be started', () => {
  const exitFn: Spy<InferableFunction> = jasmine.createSpy('exitFn');
  let argv: string[] = [];
  let stream: ReadStream;
  let object: InputFormatter;

  beforeEach(() => {
    stream = createReadStream(filePath) as unknown as ReadStream;
    object = new InputFormatter(argv, stream, exitFn);
  });

  it('should initialize input formatter', () => {
    expect(object).toBeTruthy();
  });

  it('should destroy input formatter', () => {
    object.destroy();

    expect(object['argv']).toBeFalsy();
    expect(object['stdin']).toBeFalsy();
    expect(object['exitFn']).toBeFalsy();
  });

});
