import { createReadStream } from 'fs';
import ReadStream = NodeJS.ReadStream;

export async function inputFromCli(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    let data = '';

    stream.on('data', function(chunk) {
      data += chunk;
    });

    stream.on('end', function() {
      resolve(data.split('\n'));
    });
    stream.on('error', function(error) {
      reject(error);
    });
  });
}

export async function inputFromStdin(stdin: ReadStream): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let data = '';

    stdin.on('readable', () => {
      let chunk: string | Buffer;
      // tslint:disable-next-line:no-conditional-assignment
      while ((chunk = stdin.read()) !== null) {
        data += chunk;
      }
    });

    stdin.on('end', function() {
      resolve(data.split('\n'));
    });
    stdin.on('error', function(error) {
      reject(error);
    });
  });
}
