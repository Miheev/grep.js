import { JsRegExpEngine } from '../../src/regExp/JsRegExpEngine';

describe('should JsRegExpEngine run', () => {
  const keyword = 'key';
  let object: JsRegExpEngine;


  beforeEach(() => {
    object = new JsRegExpEngine(keyword);
  });

  it('should thrown error on matchLine without pattern', () => {
    expect(function() {
      object.matchLine({index: 0, line: 'xxx'});
    }).toThrow();
  });
});
