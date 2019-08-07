import { map, MapStream } from 'event-stream';
import reduce from 'stream-reduce';

import { ConsoleColors, EventStreamCallback, GrepLine } from '../models';

export function showMatchCount(resultStream: MapStream, end: () => void): MapStream {
  end();
  return resultStream.pipe(reduce((acc: number) => acc + 1, 0));
}

export function showLineNumber(resultStream: MapStream, end: () => void): MapStream {
  end();
  return resultStream.pipe(
    map((resultLine: GrepLine, cb: EventStreamCallback) => {
      cb(null, [ConsoleColors.green, resultLine.index + ':', ...showMatchedLine(resultLine)]);
    }),
  );
}

export function showMatchedLineList(resultStream: MapStream, end: () => void): MapStream {
  end();
  return resultStream.pipe(
    map((resultLine: GrepLine, cb: EventStreamCallback) => {
      cb(null, showMatchedLine(resultLine));
    }),
  );
}

export function showMatchedLine(resultLine: GrepLine): string[] {
  if (!resultLine.foundIndexList || !resultLine.foundIndexList.length) {
    return [ConsoleColors.default, resultLine.line];
  }

  let index = 0;
  const lineParts: string[] = [];
  resultLine.foundIndexList.forEach(section => {
    if (section[0] !== index) {
      lineParts.push(ConsoleColors.default, resultLine.line.substring(index, section[0]));
    }
    lineParts.push(ConsoleColors.red, resultLine.line.substring(section[0], section[1]));

    index = section[1];
  });

  if (index < resultLine.line.length) {
    lineParts.push(ConsoleColors.default, resultLine.line.substring(index, resultLine.line.length));
  }

  return [lineParts.join('')];
}
