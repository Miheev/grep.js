import { InputFormatter } from './inputFormatter';
import { outputLines } from './outputLines';
import { PatternSearch } from './patternSearch';

// tslint:disable-next-line:no-unused-expression
!(async function() {
  let input = new InputFormatter(process.argv.slice(2), process.stdin, process.exit);
  await input.prepareData();

  let searcher = new PatternSearch(input);

  outputLines(searcher.findAll(), input.pipes.output);

  process.on('exit', () => {
    input.destroy();
  });
})();
