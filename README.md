# grep.js

grep via NodeJS

## grep.js based on grep (GNU grep) 3.1 and follows common grep behaviour
- Syntax is follows general Unix command lines rules
- Option can be placed at any position (`grep -x ### /path/to/file` or `grep ### -x /path/to/file` or `grep ### /path/to/file -x`)
- File path defined as console argument has higher priority under linux pipe syntax (if `cat /path/one | grep -x ### /path/two`, then `/path/two` will be used as input)
- Quotes behaviours: not required for single word search, double and single quoted text treated the same (`grep ### /path/to/file -x` or `grep '###' /path/to/file -x` or `grep "###" /path/to/file -x`)

## Features
- without parameters: output lines with keyword highlighted, case-sensitive (`grep ### /path/to/file`)
- `-i`: case-insensitive search
- `-v`: exclusive search, output lines, which not contains the keyword
- `-c`: output count of found lines with provided keyword
- `-n`: output highlighted line numbers along with text lines
- parameters combinations
