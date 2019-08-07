import { ConsoleColors, GrepLine } from '../models';

export function showMatchCount(resultList: GrepLine[], end: () => void): number {
  end();
  return resultList.length;
}

export function showLineNumber(resultList: GrepLine[], end: () => void): string[][] {
  end();
  return resultList.map(resultLine => {
    return [ConsoleColors.green, resultLine.index + ':', ...showMatchedLine(resultLine)];
  });
}

export function showMatchedLineList(resultList: GrepLine[], end: () => void): string[][] {
  end();
  return resultList.map(showMatchedLine);
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
