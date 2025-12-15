export enum TokenType {
  // Literals
  String = 'STRING',
  Number = 'NUMBER',
  Boolean = 'BOOLEAN',
  Identifier = 'IDENTIFIER',
  
  // Punctuation
  Colon = ':',
  Comma = ',',
  Semicolon = ';',
  LBracket = '[',
  RBracket = ']',
  LBrace = '{',
  RBrace = '}',
  
  // Directives
  AtAlias = '@alias',
  AtBlock = '@block',
  
  // Structure
  Newline = 'NEWLINE',
  Indent = 'INDENT',
  Dedent = 'DEDENT',
  EOF = 'EOF'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export type OryxValue = string | number | boolean | null | OryxObject | OryxArray;
export type OryxObject = { [key: string]: OryxValue };
export type OryxArray = OryxValue[];
