import { Token, TokenType } from './types';

export class Tokenizer {
  private input: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;
  private indentStack: number[] = [0];
  private tokens: Token[] = [];
  private atLineStart: boolean = true;

  constructor(input: string) {
    this.input = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  tokenize(): Token[] {
    while (!this.eof()) {
      if (this.atLineStart) {
        this.handleLineStart();
      } else {
        this.scanToken();
      }
    }

    // Emit remaining dedents
    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      this.emit(TokenType.Dedent, '');
    }

    this.emit(TokenType.EOF, '');
    return this.tokens;
  }

  private handleLineStart() {
    // Count leading whitespace
    const startPos = this.pos;
    let indent = 0;
    
    while (!this.eof() && (this.peek() === ' ' || this.peek() === '\t')) {
      indent += this.peek() === '\t' ? 2 : 1;
      this.advance();
    }

    // Skip empty lines
    if (this.peek() === '\n') {
      this.advance();
      this.line++;
      this.col = 1;
      return; // Stay at line start
    }

    // Skip comment lines
    if (this.peek() === '#') {
      this.skipToEndOfLine();
      if (this.peek() === '\n') {
        this.advance();
        this.line++;
        this.col = 1;
      }
      return; // Stay at line start
    }

    // Process indentation changes
    const prevIndent = this.indentStack[this.indentStack.length - 1];

    if (indent > prevIndent) {
      this.indentStack.push(indent);
      this.emit(TokenType.Indent, '');
    } else if (indent < prevIndent) {
      while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > indent) {
        this.indentStack.pop();
        this.emit(TokenType.Dedent, '');
      }
    }

    this.atLineStart = false;
  }

  private scanToken() {
    this.skipSpaces();

    if (this.eof()) return;

    const ch = this.peek();

    // Newline
    if (ch === '\n') {
      this.emit(TokenType.Newline, '\n');
      this.advance();
      this.line++;
      this.col = 1;
      this.atLineStart = true;
      return;
    }

    // Comment
    if (ch === '#') {
      this.skipToEndOfLine();
      return;
    }

    // Single char tokens
    if (ch === ':') { this.emit(TokenType.Colon, ':'); this.advance(); return; }
    if (ch === ',') { this.emit(TokenType.Comma, ','); this.advance(); return; }
    if (ch === ';') { this.emit(TokenType.Semicolon, ';'); this.advance(); return; }
    if (ch === '[') { this.emit(TokenType.LBracket, '['); this.advance(); return; }
    if (ch === ']') { this.emit(TokenType.RBracket, ']'); this.advance(); return; }
    if (ch === '{') { this.emit(TokenType.LBrace, '{'); this.advance(); return; }
    if (ch === '}') { this.emit(TokenType.RBrace, '}'); this.advance(); return; }

    // Directives
    if (ch === '@') {
      const word = this.readWhile(c => /[a-zA-Z@]/.test(c));
      if (word === '@alias') {
        this.emit(TokenType.AtAlias, word);
      } else if (word === '@block') {
        this.emit(TokenType.AtBlock, word);
      } else {
        this.emit(TokenType.Identifier, word);
      }
      return;
    }

    // Quoted string
    if (ch === '"' || ch === "'") {
      this.emit(TokenType.String, this.readString());
      return;
    }

    // Number or compound value like "24/7"
    if (this.isDigit(ch) || (ch === '-' && this.isDigit(this.peekNext()))) {
      const num = this.readNumber();
      // Check if followed by more value chars (e.g., "24/7", "09:00")
      if (this.isValueChar(this.peek())) {
        let compound = num;
        compound += this.readWhile(c => this.isValueChar(c));
        this.emit(TokenType.Identifier, compound);
      } else {
        this.emit(TokenType.Number, num);
      }
      return;
    }

    // Identifier or keyword
    if (this.isIdentifierStart(ch)) {
      const word = this.readWhile(c => this.isIdentifierChar(c));
      if (word === 'true' || word === 'false') {
        this.emit(TokenType.Boolean, word);
      } else {
        this.emit(TokenType.Identifier, word);
      }
      return;
    }

    // Special values like "..." or other symbols that can be values
    if (ch === '.') {
      const dots = this.readWhile(c => c === '.' || this.isIdentifierChar(c));
      this.emit(TokenType.Identifier, dots);
      return;
    }

    throw new Error(`Unexpected character '${ch}' at line ${this.line}:${this.col}`);
  }

  // Helpers
  private eof(): boolean {
    return this.pos >= this.input.length;
  }

  private peek(): string {
    return this.input[this.pos] || '';
  }

  private peekNext(): string {
    return this.input[this.pos + 1] || '';
  }

  private advance(): string {
    const ch = this.peek();
    this.pos++;
    this.col++;
    return ch;
  }

  private emit(type: TokenType, value: string) {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: Math.max(1, this.col - value.length)
    });
  }

  private skipSpaces() {
    while (!this.eof() && (this.peek() === ' ' || this.peek() === '\t')) {
      this.advance();
    }
  }

  private skipToEndOfLine() {
    while (!this.eof() && this.peek() !== '\n') {
      this.advance();
    }
  }

  private readWhile(predicate: (ch: string) => boolean): string {
    let result = '';
    while (!this.eof() && predicate(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  private readString(): string {
    const quote = this.advance();
    let result = '';
    
    while (!this.eof() && this.peek() !== quote) {
      if (this.peek() === '\\' && this.peekNext()) {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': result += '\n'; break;
          case 't': result += '\t'; break;
          case 'r': result += '\r'; break;
          default: result += escaped;
        }
      } else {
        result += this.advance();
      }
    }
    
    if (!this.eof()) this.advance(); // closing quote
    return result;
  }

  private readNumber(): string {
    let result = '';
    
    if (this.peek() === '-') {
      result += this.advance();
    }
    
    result += this.readWhile(c => this.isDigit(c));
    
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      result += this.advance(); // '.'
      result += this.readWhile(c => this.isDigit(c));
    }
    
    return result;
  }

  private isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9';
  }

  private isIdentifierStart(ch: string): boolean {
    return /[a-zA-Z_\u00C0-\u024F]/.test(ch);
  }

  private isIdentifierChar(ch: string): boolean {
    return /[a-zA-Z0-9_\-./@\u00C0-\u024F]/.test(ch);
  }

  private isValueChar(ch: string): boolean {
    return /[a-zA-Z0-9_\-./:@\u00C0-\u024F]/.test(ch);
  }
}
