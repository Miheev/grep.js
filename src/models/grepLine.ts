export interface GrepLine {
  index: number;
  line: string;
  matches?: string[];
  foundIndexList?: number[][];
}
