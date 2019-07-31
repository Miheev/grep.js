import { inputFromCli, inputFromStdin } from './inputData';
import { PipeConfig, PipeFuntion, PipeOrderedMap } from './models';
import { caseInsensitiveSearch, inverseSearch } from './pipes/regExpPipes';
import { showLineNumber, showMatchCount, showMatchedLineList } from './pipes/renderPipes';
import ReadStream = NodeJS.ReadStream;

export class InputFormatter {

  static usageHelpOutput(): void {
    console.log('Usage: grep [OPTION]... PATTERN [FILE]...\n' +
      'Try \'grep --help\' for more information.');
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
  textLines: string[] = [];
  pipes: PipeOrderedMap = {
    output: [],
    pattern: [],
  };

  private argv: string[];
  private stdin: ReadStream;
  private exitFn: (code?: number) => void;

  constructor(argv: string[], stdin: ReadStream, exitFn: (code?: number) => void) {
    this.argv = argv;
    this.stdin = stdin;
    this.exitFn = exitFn;

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
  }

  async prepareData(): Promise<undefined> {
    await this.transformParams();

    let lastOptionIndex = 0;
    const isOptionSupported = this.options.every((option, index) => {
      lastOptionIndex = index;
      return this.supportedOptions.has(option);
    });
    if (!isOptionSupported) {
      InputFormatter.invalidArgumentOutput(this.options[lastOptionIndex]);
      this.exit();
      return ;
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
      this.pipes.output.push(showMatchedLineList as PipeFuntion);
    }
  }

  private async transformParams(): Promise<undefined> {
    const isHelpMode = this.argv.find((arg) => arg === '--help');
    if (isHelpMode) {
      InputFormatter.helpDetailedOutput();
      this.exit();
      return ;
    }

    const params = this.argv.filter(arg => !this.isOption(arg));
    if (!params.length) {
      InputFormatter.usageHelpOutput();
      this.exit();
      return ;
    }

    this.keyword = params[0];
    let inputDataPromise: Promise<string[]>;
    if (params[1] && params[1].length) {
      inputDataPromise = inputFromCli(params[1]);
    } else {
      inputDataPromise = inputFromStdin(this.stdin);
    }

    this.options = this.argv.filter(arg => this.isOption(arg))
      .map(flag => {
        return flag.length === 2 ? flag[1] : flag.substr(1).split('');
      })
      // @ts-ignore
      .flat();

    this.textLines = await inputDataPromise;
    return;
  }

  private isOption(arg: string): boolean {
    return arg[0] === '-';
  }

  private exit() {
    this.exitFn(0);
  }
}
