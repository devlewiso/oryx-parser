export interface OryxAliasMap {
    [key: string]: string;
}
export interface OryxParseOptions {
    strict?: boolean;
}
export declare class OryxParser {
    private input;
    private options;
    private aliasMap;
    private lines;
    private index;
    constructor(input: string, options?: OryxParseOptions);
    parse(): any;
    private parseAlias;
    private parseBlock;
    private parseKeyValue;
    private parseSimpleKV;
    private isTabularHeader;
    private extractTabularHeader;
    private extractRows;
    private inferType;
    private current;
    private next;
    private eof;
    private isIndented;
}
export declare function parse(input: string, options?: OryxParseOptions): any;
//# sourceMappingURL=parser.d.ts.map