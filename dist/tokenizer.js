"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
const types_1 = require("./types");
class Tokenizer {
    constructor(input) {
        this.pos = 0;
        this.line = 1;
        this.col = 1;
        this.indentStack = [0];
        this.tokens = [];
        this.atLineStart = true;
        this.input = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    tokenize() {
        while (!this.eof()) {
            if (this.atLineStart) {
                this.handleLineStart();
            }
            else {
                this.scanToken();
            }
        }
        // Emit remaining dedents
        while (this.indentStack.length > 1) {
            this.indentStack.pop();
            this.emit(types_1.TokenType.Dedent, '');
        }
        this.emit(types_1.TokenType.EOF, '');
        return this.tokens;
    }
    handleLineStart() {
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
            this.emit(types_1.TokenType.Indent, '');
        }
        else if (indent < prevIndent) {
            while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > indent) {
                this.indentStack.pop();
                this.emit(types_1.TokenType.Dedent, '');
            }
        }
        this.atLineStart = false;
    }
    scanToken() {
        this.skipSpaces();
        if (this.eof())
            return;
        const ch = this.peek();
        // Newline
        if (ch === '\n') {
            this.emit(types_1.TokenType.Newline, '\n');
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
        if (ch === ':') {
            this.emit(types_1.TokenType.Colon, ':');
            this.advance();
            return;
        }
        if (ch === ',') {
            this.emit(types_1.TokenType.Comma, ',');
            this.advance();
            return;
        }
        if (ch === ';') {
            this.emit(types_1.TokenType.Semicolon, ';');
            this.advance();
            return;
        }
        if (ch === '[') {
            this.emit(types_1.TokenType.LBracket, '[');
            this.advance();
            return;
        }
        if (ch === ']') {
            this.emit(types_1.TokenType.RBracket, ']');
            this.advance();
            return;
        }
        if (ch === '{') {
            this.emit(types_1.TokenType.LBrace, '{');
            this.advance();
            return;
        }
        if (ch === '}') {
            this.emit(types_1.TokenType.RBrace, '}');
            this.advance();
            return;
        }
        // Directives
        if (ch === '@') {
            const word = this.readWhile(c => /[a-zA-Z@]/.test(c));
            if (word === '@alias') {
                this.emit(types_1.TokenType.AtAlias, word);
            }
            else if (word === '@block') {
                this.emit(types_1.TokenType.AtBlock, word);
            }
            else {
                this.emit(types_1.TokenType.Identifier, word);
            }
            return;
        }
        // Quoted string
        if (ch === '"' || ch === "'") {
            this.emit(types_1.TokenType.String, this.readString());
            return;
        }
        // Number or compound value like "24/7"
        if (this.isDigit(ch) || (ch === '-' && this.isDigit(this.peekNext()))) {
            const num = this.readNumber();
            // Check if followed by more value chars (e.g., "24/7", "09:00")
            if (this.isValueChar(this.peek())) {
                let compound = num;
                compound += this.readWhile(c => this.isValueChar(c));
                this.emit(types_1.TokenType.Identifier, compound);
            }
            else {
                this.emit(types_1.TokenType.Number, num);
            }
            return;
        }
        // Identifier or keyword
        if (this.isIdentifierStart(ch)) {
            const word = this.readWhile(c => this.isIdentifierChar(c));
            if (word === 'true' || word === 'false') {
                this.emit(types_1.TokenType.Boolean, word);
            }
            else {
                this.emit(types_1.TokenType.Identifier, word);
            }
            return;
        }
        // Special values like "..." or other symbols that can be values
        if (ch === '.') {
            const dots = this.readWhile(c => c === '.' || this.isIdentifierChar(c));
            this.emit(types_1.TokenType.Identifier, dots);
            return;
        }
        throw new Error(`Unexpected character '${ch}' at line ${this.line}:${this.col}`);
    }
    // Helpers
    eof() {
        return this.pos >= this.input.length;
    }
    peek() {
        return this.input[this.pos] || '';
    }
    peekNext() {
        return this.input[this.pos + 1] || '';
    }
    advance() {
        const ch = this.peek();
        this.pos++;
        this.col++;
        return ch;
    }
    emit(type, value) {
        this.tokens.push({
            type,
            value,
            line: this.line,
            column: Math.max(1, this.col - value.length)
        });
    }
    skipSpaces() {
        while (!this.eof() && (this.peek() === ' ' || this.peek() === '\t')) {
            this.advance();
        }
    }
    skipToEndOfLine() {
        while (!this.eof() && this.peek() !== '\n') {
            this.advance();
        }
    }
    readWhile(predicate) {
        let result = '';
        while (!this.eof() && predicate(this.peek())) {
            result += this.advance();
        }
        return result;
    }
    readString() {
        const quote = this.advance();
        let result = '';
        while (!this.eof() && this.peek() !== quote) {
            if (this.peek() === '\\' && this.peekNext()) {
                this.advance();
                const escaped = this.advance();
                switch (escaped) {
                    case 'n':
                        result += '\n';
                        break;
                    case 't':
                        result += '\t';
                        break;
                    case 'r':
                        result += '\r';
                        break;
                    default: result += escaped;
                }
            }
            else {
                result += this.advance();
            }
        }
        if (!this.eof())
            this.advance(); // closing quote
        return result;
    }
    readNumber() {
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
    isDigit(ch) {
        return ch >= '0' && ch <= '9';
    }
    isIdentifierStart(ch) {
        return /[a-zA-Z_\u00C0-\u024F]/.test(ch);
    }
    isIdentifierChar(ch) {
        return /[a-zA-Z0-9_\-./@\u00C0-\u024F]/.test(ch);
    }
    isValueChar(ch) {
        return /[a-zA-Z0-9_\-./:@\u00C0-\u024F]/.test(ch);
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map