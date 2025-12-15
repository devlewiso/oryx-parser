export declare enum TokenType {
    String = "STRING",
    Number = "NUMBER",
    Boolean = "BOOLEAN",
    Identifier = "IDENTIFIER",
    Colon = ":",
    Comma = ",",
    Semicolon = ";",
    LBracket = "[",
    RBracket = "]",
    LBrace = "{",
    RBrace = "}",
    AtAlias = "@alias",
    AtBlock = "@block",
    Newline = "NEWLINE",
    Indent = "INDENT",
    Dedent = "DEDENT",
    EOF = "EOF"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}
export type OryxValue = string | number | boolean | null | OryxObject | OryxArray;
export type OryxObject = {
    [key: string]: OryxValue;
};
export type OryxArray = OryxValue[];
//# sourceMappingURL=types.d.ts.map