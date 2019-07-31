import { GrepLine, IRegExpEngine } from '../models';

export class JsRegExpEngine implements IRegExpEngine {
  isInverse = false;
  flags = ['g'];

  private keyword = '';
  private pattern: RegExp | null = null;

  constructor(keyword: string) {
    this.keyword = keyword;
  }

  createPattern(): void {
    this.pattern = new RegExp(this.keyword, this.flags.join(''));
  }

  matchLine(searchItem: GrepLine): GrepLine | boolean {
    if (!this.pattern) {
      throw Error('Pattern not defined. Pattern should be created before matching lines');
    }

    const result = searchItem.line.match(this.pattern);
    if (!result && this.isInverse) {
      return searchItem;
    }
    if (!result) {
      return false;
    }
    if (this.isInverse) {
      return false;
    }

    let startIndex = 0;
    let wordIndexList;
    searchItem.matches = result;
    searchItem.foundIndexList = result.map(word => {
      wordIndexList = [];
      wordIndexList[0] = searchItem.line.indexOf(word, startIndex);
      wordIndexList[1] = wordIndexList[0] + word.length;
      startIndex = wordIndexList[0] !== wordIndexList[1] ? wordIndexList[1] : wordIndexList[1] + 1;

      return wordIndexList;
    });

    return searchItem;
  }
}
