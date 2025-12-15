import { Token, TokenType, OryxValue, OryxObject } from './types';
import { Tokenizer } from './tokenizer';

export class Parser {
  private tokens: Token[];
  private pos: number = 0;
  private aliases: Map<string, string> = new Map();

  constructor(input: string) {
    const tokenizer = new Tokenizer(input);
    this.tokens = tokenizer.tokenize();
  }

  parse(): OryxObject {
    const result: OryxObject = {};

    while (!this.isAtEnd()) {
      this.skipNewlines();
      if (this.isAtEnd()) break;
      
      // Skip stray dedents at top level
      if (this.check(TokenType.Dedent)) {
        this.advance();
        continue;
      }

      this.parseStatement(result);
    }

    return result;
  }

  private parseStatement(target: OryxObject) {
    if (this.check(TokenType.AtAlias)) {
      this.advance();
      this.parseAlias();
    } else if (this.check(TokenType.AtBlock)) {
      this.advance();
      this.parseBlock(target);
    } else if (this.check(TokenType.Identifier)) {
      this.parseKeyValue(target);
    }
  }

  private parseAlias() {
    this.consume(TokenType.LBrace, "Expected '{' after @alias");
    
    while (!this.check(TokenType.RBrace) && !this.isAtEnd()) {
      const longName = this.consume(TokenType.Identifier, "Expected identifier").value;
      this.consume(TokenType.Colon, "Expected ':'");
      const shortName = this.consume(TokenType.Identifier, "Expected identifier").value;
      
      this.aliases.set(shortName, longName);
      
      if (!this.check(TokenType.RBrace)) {
        this.consume(TokenType.Comma, "Expected ',' or '}'");
      }
    }
    
    this.consume(TokenType.RBrace, "Expected '}'");
    this.skipNewlines();
  }

  private parseBlock(target: OryxObject) {
    const name = this.consume(TokenType.Identifier, "Expected block name").value;
    this.consume(TokenType.Colon, "Expected ':'");
    this.consume(TokenType.Newline, "Expected newline");
    this.consume(TokenType.Indent, "Expected indent");

    const content: OryxObject = {};
    
    while (!this.check(TokenType.Dedent) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.Dedent)) break;
      this.parseKeyValue(content);
    }

    if (this.check(TokenType.Dedent)) this.advance();
    
    target[name] = content;
  }

  private parseKeyValue(target: OryxObject) {
    const keyToken = this.consume(TokenType.Identifier, "Expected key");
    const key = this.resolveAlias(keyToken.value);

    // Check for array syntax: key[size] or key[size]{fields}
    if (this.check(TokenType.LBracket)) {
      this.advance();
      const size = parseInt(this.consume(TokenType.Number, "Expected size").value);
      this.consume(TokenType.RBracket, "Expected ']'");

      if (this.check(TokenType.LBrace)) {
        // Tabular array: key[size]{f1,f2}:
        this.parseTabular(target, key, size);
      } else {
        // Simple array: key[size]: v1, v2
        this.consume(TokenType.Colon, "Expected ':'");
        target[key] = this.parseSimpleArray(size);
      }
    } else {
      // Regular key-value
      this.consume(TokenType.Colon, "Expected ':'");

      if (this.check(TokenType.Newline)) {
        // Nested object
        this.advance();
        if (this.check(TokenType.Indent)) {
          this.advance();
          const nested: OryxObject = {};
          
          while (!this.check(TokenType.Dedent) && !this.isAtEnd()) {
            this.skipNewlines();
            if (this.check(TokenType.Dedent)) break;
            this.parseKeyValue(nested);
          }
          
          if (this.check(TokenType.Dedent)) this.advance();
          target[key] = nested;
        } else {
          target[key] = {};
        }
      } else {
        // Inline value
        target[key] = this.parseValue();
        this.skipNewlines();
      }
    }
  }

  private parseSimpleArray(size: number): OryxValue[] {
    const arr: OryxValue[] = [];
    
    for (let i = 0; i < size; i++) {
      arr.push(this.parseValue());
      if (i < size - 1) {
        this.consume(TokenType.Comma, "Expected ','");
      }
    }
    
    this.skipNewlines();
    return arr;
  }

  private parseTabular(target: OryxObject, key: string, size: number) {
    this.advance(); // consume '{'
    
    // Parse field names
    const fields: string[] = [];
    while (!this.check(TokenType.RBrace) && !this.isAtEnd()) {
      const field = this.consume(TokenType.Identifier, "Expected field name").value;
      fields.push(this.resolveAlias(field));
      if (!this.check(TokenType.RBrace)) {
        this.consume(TokenType.Comma, "Expected ',' or '}'");
      }
    }
    this.consume(TokenType.RBrace, "Expected '}'");
    this.consume(TokenType.Colon, "Expected ':'");

    const rows: OryxObject[] = [];
    
    // Check mode: dense (inline) or multi-line
    const isDense = !this.check(TokenType.Newline);
    
    if (!isDense) {
      this.advance(); // consume newline
      this.consume(TokenType.Indent, "Expected indent");
    }

    for (let i = 0; i < size; i++) {
      const row: OryxObject = {};
      
      for (let j = 0; j < fields.length; j++) {
        row[fields[j]] = this.parseValue();
        if (j < fields.length - 1) {
          this.consume(TokenType.Comma, "Expected ','");
        }
      }
      
      rows.push(row);

      // Handle row separator
      if (i < size - 1) {
        if (isDense) {
          this.consume(TokenType.Semicolon, "Expected ';'");
        } else {
          this.skipNewlines();
        }
      }
    }

    if (!isDense) {
      this.skipNewlines();
      if (this.check(TokenType.Dedent)) this.advance();
    } else {
      this.skipNewlines();
    }

    target[key] = rows;
  }

  private parseValue(): OryxValue {
    // Quoted string
    if (this.check(TokenType.String)) {
      return this.advance().value;
    }

    // Boolean
    if (this.check(TokenType.Boolean)) {
      return this.advance().value === 'true';
    }

    // Collect all tokens until delimiter
    const parts: string[] = [];
    let hasNonNumber = false;

    while (!this.isAtEnd() && !this.isValueEnd()) {
      const token = this.advance();
      parts.push(token.value);
      
      if (token.type !== TokenType.Number) {
        hasNonNumber = true;
      }
    }

    if (parts.length === 0) return null;

    const result = parts.join(' ').trim();

    // Type inference
    if (!hasNonNumber && parts.length === 1) {
      if (result.includes('.')) {
        return parseFloat(result);
      }
      return parseInt(result);
    }

    // Check if it's a pure number string
    if (/^-?\d+(\.\d+)?$/.test(result)) {
      return result.includes('.') ? parseFloat(result) : parseInt(result);
    }

    return result;
  }

  private isValueEnd(): boolean {
    const type = this.peek().type;
    return type === TokenType.Comma ||
           type === TokenType.Semicolon ||
           type === TokenType.Newline ||
           type === TokenType.Dedent ||
           type === TokenType.EOF ||
           type === TokenType.RBrace ||
           type === TokenType.Colon;
  }

  private resolveAlias(name: string): string {
    return this.aliases.get(name) || name;
  }

  // Token helpers
  private peek(): Token {
    return this.tokens[this.pos] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
  }

  private advance(): Token {
    const token = this.peek();
    if (!this.isAtEnd()) this.pos++;
    return token;
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    const t = this.peek();
    throw new Error(`${message}. Got ${t.type} ('${t.value}') at line ${t.line}`);
  }

  private skipNewlines() {
    while (this.check(TokenType.Newline)) {
      this.advance();
    }
  }
}
