import { createReadStream } from 'fs';
import ReadStream = NodeJS.ReadStream;

export async function inputFromCli(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    let data = '';

    stream.on('data', (chunk) => data += chunk);

    stream.on('end', () => resolve(data.split('\n')));
    stream.on('error', (error) => reject(error));
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

    stdin.on('end', () => resolve(data.split('\n')));
    stdin.on('error', (error) => reject(error));
  });
}
