import { OryxObject } from './types';
export declare class Parser {
    private tokens;
    private pos;
    private aliases;
    constructor(input: string);
    parse(): OryxObject;
    private parseStatement;
    private parseAlias;
    private parseBlock;
    private parseKeyValue;
    private parseSimpleArray;
    private parseTabular;
    private parseValue;
    private isValueEnd;
    private resolveAlias;
    private peek;
    private advance;
    private check;
    private isAtEnd;
    private consume;
    private skipNewlines;
}
//# sourceMappingURL=parser.d.ts.map