import { createReadStream } from 'fs';
import { inputFromCli, inputFromStdin } from '../src/inputData';
import ReadStream = NodeJS.ReadStream;

const expectedInput = ['test file content', ''];
const filePath = './spec/helpers/test-file.txt';

describe('Should handle different types of input', () => {

  it('should get data from file path via cli', async () => {
    let data: string[] = await inputFromCli(filePath);

    expect(data).toEqual(expectedInput);
  });

  it('should throw error on file path via cli', async () => {
    let promise = inputFromCli(filePath + 'xxx');

    expectAsync(promise).toBeRejected();
  });

  it('should get data from ReadStream', async () => {
    let stream = createReadStream(filePath);
    let data: string[] = await inputFromStdin(stream as unknown as ReadStream);

    expect(data).toEqual(expectedInput);
  });

  it('should throw error on data from ReadStream', async () => {
    let stream = createReadStream(filePath + 'xxx');
    let promise = inputFromStdin(stream as unknown as ReadStream);

    expectAsync(promise).toBeRejected();
  });
});
