import ReadableStream = NodeJS.ReadableStream;
import { createReadStream } from 'fs';

import { PipeConfig, PipeFunction, PipeOrderedMap } from './models';
import { caseInsensitiveSearch, inverseSearch } from './pipes/regExpPipes';
import { showLineNumber, showMatchCount, showMatchedLineList } from './pipes/renderPipes';

export class InputFormatter {
  static usageHelpOutput(): void {
    console.log('Usage: grep [OPTION]... PATTERN [FILE]...\n' + "Try 'grep --help' for more information.");
  }

  static invalidArgumentOutput(option: string): void {
    console.log(`grep: invalid option -- '${option}'`);
    InputFormatter.usageHelpOutput();
  }

  static helpDetailedOutput(): void {
    InputFormatter.usageHelpOutput();
    console.log(`
       -i   case-insensitive search
       -v   exclusive search, output lines, which not contains the keyword
       -c   output count of found lines with provided keyword
       -n   output highlighted line numbers along with text lines
    `);
  }

  supportedOptions: Map<string, PipeConfig>;
  keyword = '';
  options: string[] = [];

  /**
   * @see https://www.npmjs.com/package/event-stream
   * @see https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33
   * @see https://dev.to/itmayziii/how-to-process-epic-amounts-of-data-in-nodejs-16hl
   * @see https://coderwall.com/p/ohjerg/read-large-text-files-in-nodejs
   */
  textStream: ReadableStream;

  pipes: PipeOrderedMap = {
    output: [],
    pattern: [],
  };

  private argv: string[];
  private stdin: ReadableStream;
  private exitFn: (code?: number) => void;

  constructor(argv: string[], stdin: ReadableStream, exitFn: (code?: number) => void) {
    this.argv = argv;
    this.stdin = stdin;
    this.exitFn = exitFn;

    this.textStream = this.stdin;

    this.supportedOptions = new Map<string, PipeConfig>([
      ['i', ['pattern', 'push', caseInsensitiveSearch]],
      ['v', ['pattern', 'push', inverseSearch]],
      ['c', ['output', 'unshift', showMatchCount]],
      ['n', ['output', 'push', showLineNumber]],
    ] as Array<[string, PipeConfig]>);
  }

  destroy(): void {
    delete this.exitFn;
    delete this.stdin;
    delete this.argv;
    delete this.textStream;
  }

  async prepareData(): Promise<undefined> {
    await this.transformParams();

    const unsupportedOption: string | undefined = this.options.find(option => {
      return !this.supportedOptions.has(option);
    });
    if (unsupportedOption) {
      InputFormatter.invalidArgumentOutput(unsupportedOption);
      this.exit();
      return;
    }

    this.fillPipes();
    return;
  }

  private fillPipes(): void {
    let item: PipeConfig;
    this.options.forEach(option => {
      item = this.supportedOptions.get(option) as PipeConfig;
      this.pipes[item[0]][item[1]](item[2]);
    });

    if (!this.pipes.output.length) {
      this.pipes.output.push(showMatchedLineList as PipeFunction);
    }
  }

  private transformParams(): void {
    const isHelpMode = this.argv.find(arg => arg === '--help');
    if (isHelpMode) {
      InputFormatter.helpDetailedOutput();
      this.exit();
      return;
    }

    const params = this.argv.filter(arg => !this.isOption(arg));
    if (!params.length) {
      InputFormatter.usageHelpOutput();
      this.exit();
      return;
    }

    this.keyword = params[0];
    if (params[1] && params[1].length) {
      this.textStream = createReadStream(params[1]);
    }

    this.options = this.argv
      .filter(arg => this.isOption(arg))
      .map(flag => {
        return flag.length === 2 ? flag[1] : flag.substr(1).split('');
      })
      // @ts-ignore
      .flat();

    /*
    let separatedOptions: string[];
    this.options = this.argv.reduce((acc, arg) => {
       if (this.isOption(arg)) {
         separatedOptions = arg.slice(1).split('');
         acc.push(...separatedOptions);
       }
        return acc;
      },
    [] as string[]);
    */

    return;
  }

  private isOption(arg: string): boolean {
    return arg[0] === '-';
  }

  private exit() {
    this.exitFn(0);
  }
}
