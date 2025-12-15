import { Token } from './types';
export declare class Tokenizer {
    private input;
    private pos;
    private line;
    private col;
    private indentStack;
    private tokens;
    private atLineStart;
    constructor(input: string);
    tokenize(): Token[];
    private handleLineStart;
    private scanToken;
    private eof;
    private peek;
    private peekNext;
    private advance;
    private emit;
    private skipSpaces;
    private skipToEndOfLine;
    private readWhile;
    private readString;
    private readNumber;
    private isDigit;
    private isIdentifierStart;
    private isIdentifierChar;
    private isValueChar;
}
//# sourceMappingURL=tokenizer.d.ts.map