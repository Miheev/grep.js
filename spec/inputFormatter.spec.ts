import { createReadStream } from 'fs';
import { InputFormatter } from '../src/inputFormatter';
import Spy = jasmine.Spy;
import ReadStream = NodeJS.ReadStream;

const filePath = './spec/helpers/test-file.txt';

describe('should format input before search will be started', () => {
  let exitFn: Spy<InferableFunction>;
  let argv: string[] = [];
  let stream: ReadStream;
  let object: InputFormatter;

  let helpDetailedOutput: () => void = InputFormatter.helpDetailedOutput;
  let usageHelpOutput: () => void = InputFormatter.usageHelpOutput;
  let invalidArgumentOutput: (option: string) => void = InputFormatter.invalidArgumentOutput;

  beforeEach(() => {
    exitFn = jasmine.createSpy('exitFn');
    stream = createReadStream(filePath) as unknown as ReadStream;
    object = new InputFormatter(argv, stream, exitFn);

    spyOn(InputFormatter, 'helpDetailedOutput').and.callThrough();
    spyOn(InputFormatter, 'usageHelpOutput').and.callThrough();
    spyOn(InputFormatter, 'invalidArgumentOutput').and.callThrough();
  });

  afterEach(() => {
    InputFormatter.helpDetailedOutput = helpDetailedOutput;
    InputFormatter.usageHelpOutput = usageHelpOutput;
    InputFormatter.invalidArgumentOutput = invalidArgumentOutput;
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

  it('should show extended help', async () => {
    object['argv'] = ['a', '-b', '--help'];

    await object.prepareData();

    expect(exitFn).toHaveBeenCalled();
    expect(InputFormatter.helpDetailedOutput).toHaveBeenCalled();
  });

  it('should show extended help', async () => {
    object['argv'] = ['a', '-b', '--help'];

    await object.prepareData();

    expect(exitFn).toHaveBeenCalled();
    expect(InputFormatter.helpDetailedOutput).toHaveBeenCalled();
  });

  it('should show help on pattern not found', async () => {
    object['argv'] = ['-a', '-b'];

    await object.prepareData();

    expect(exitFn).toHaveBeenCalled();
    expect(InputFormatter.usageHelpOutput).toHaveBeenCalled();
  });

  it('should show help on not supported options', async () => {
    object['argv'] = ['abc', '-bc'];

    await object.prepareData();

    expect(exitFn).toHaveBeenCalled();
    expect(InputFormatter.invalidArgumentOutput).toHaveBeenCalled();
  });

  it('should fill process input', async () => {
    object['argv'] = ['abc', '-vi', filePath];

    await object.prepareData();

    expect(object.pipes.output.length).toBe(1);
    expect(object.pipes.pattern.length).toBe(2);
  });
});
