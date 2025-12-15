"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const types_1 = require("./types");
const tokenizer_1 = require("./tokenizer");
class Parser {
    constructor(input) {
        this.pos = 0;
        this.aliases = new Map();
        const tokenizer = new tokenizer_1.Tokenizer(input);
        this.tokens = tokenizer.tokenize();
    }
    parse() {
        const result = {};
        while (!this.isAtEnd()) {
            this.skipNewlines();
            if (this.isAtEnd())
                break;
            // Skip stray dedents at top level
            if (this.check(types_1.TokenType.Dedent)) {
                this.advance();
                continue;
            }
            this.parseStatement(result);
        }
        return result;
    }
    parseStatement(target) {
        if (this.check(types_1.TokenType.AtAlias)) {
            this.advance();
            this.parseAlias();
        }
        else if (this.check(types_1.TokenType.AtBlock)) {
            this.advance();
            this.parseBlock(target);
        }
        else if (this.check(types_1.TokenType.Identifier)) {
            this.parseKeyValue(target);
        }
    }
    parseAlias() {
        this.consume(types_1.TokenType.LBrace, "Expected '{' after @alias");
        while (!this.check(types_1.TokenType.RBrace) && !this.isAtEnd()) {
            const longName = this.consume(types_1.TokenType.Identifier, "Expected identifier").value;
            this.consume(types_1.TokenType.Colon, "Expected ':'");
            const shortName = this.consume(types_1.TokenType.Identifier, "Expected identifier").value;
            this.aliases.set(shortName, longName);
            if (!this.check(types_1.TokenType.RBrace)) {
                this.consume(types_1.TokenType.Comma, "Expected ',' or '}'");
            }
        }
        this.consume(types_1.TokenType.RBrace, "Expected '}'");
        this.skipNewlines();
    }
    parseBlock(target) {
        const name = this.consume(types_1.TokenType.Identifier, "Expected block name").value;
        this.consume(types_1.TokenType.Colon, "Expected ':'");
        this.consume(types_1.TokenType.Newline, "Expected newline");
        this.consume(types_1.TokenType.Indent, "Expected indent");
        const content = {};
        while (!this.check(types_1.TokenType.Dedent) && !this.isAtEnd()) {
            this.skipNewlines();
            if (this.check(types_1.TokenType.Dedent))
                break;
            this.parseKeyValue(content);
        }
        if (this.check(types_1.TokenType.Dedent))
            this.advance();
        target[name] = content;
    }
    parseKeyValue(target) {
        const keyToken = this.consume(types_1.TokenType.Identifier, "Expected key");
        const key = this.resolveAlias(keyToken.value);
        // Check for array syntax: key[size] or key[size]{fields}
        if (this.check(types_1.TokenType.LBracket)) {
            this.advance();
            const size = parseInt(this.consume(types_1.TokenType.Number, "Expected size").value);
            this.consume(types_1.TokenType.RBracket, "Expected ']'");
            if (this.check(types_1.TokenType.LBrace)) {
                // Tabular array: key[size]{f1,f2}:
                this.parseTabular(target, key, size);
            }
            else {
                // Simple array: key[size]: v1, v2
                this.consume(types_1.TokenType.Colon, "Expected ':'");
                target[key] = this.parseSimpleArray(size);
            }
        }
        else {
            // Regular key-value
            this.consume(types_1.TokenType.Colon, "Expected ':'");
            if (this.check(types_1.TokenType.Newline)) {
                // Nested object
                this.advance();
                if (this.check(types_1.TokenType.Indent)) {
                    this.advance();
                    const nested = {};
                    while (!this.check(types_1.TokenType.Dedent) && !this.isAtEnd()) {
                        this.skipNewlines();
                        if (this.check(types_1.TokenType.Dedent))
                            break;
                        this.parseKeyValue(nested);
                    }
                    if (this.check(types_1.TokenType.Dedent))
                        this.advance();
                    target[key] = nested;
                }
                else {
                    target[key] = {};
                }
            }
            else {
                // Inline value
                target[key] = this.parseValue();
                this.skipNewlines();
            }
        }
    }
    parseSimpleArray(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(this.parseValue());
            if (i < size - 1) {
                this.consume(types_1.TokenType.Comma, "Expected ','");
            }
        }
        this.skipNewlines();
        return arr;
    }
    parseTabular(target, key, size) {
        this.advance(); // consume '{'
        // Parse field names
        const fields = [];
        while (!this.check(types_1.TokenType.RBrace) && !this.isAtEnd()) {
            const field = this.consume(types_1.TokenType.Identifier, "Expected field name").value;
            fields.push(this.resolveAlias(field));
            if (!this.check(types_1.TokenType.RBrace)) {
                this.consume(types_1.TokenType.Comma, "Expected ',' or '}'");
            }
        }
        this.consume(types_1.TokenType.RBrace, "Expected '}'");
        this.consume(types_1.TokenType.Colon, "Expected ':'");
        const rows = [];
        // Check mode: dense (inline) or multi-line
        const isDense = !this.check(types_1.TokenType.Newline);
        if (!isDense) {
            this.advance(); // consume newline
            this.consume(types_1.TokenType.Indent, "Expected indent");
        }
        for (let i = 0; i < size; i++) {
            const row = {};
            for (let j = 0; j < fields.length; j++) {
                row[fields[j]] = this.parseValue();
                if (j < fields.length - 1) {
                    this.consume(types_1.TokenType.Comma, "Expected ','");
                }
            }
            rows.push(row);
            // Handle row separator
            if (i < size - 1) {
                if (isDense) {
                    this.consume(types_1.TokenType.Semicolon, "Expected ';'");
                }
                else {
                    this.skipNewlines();
                }
            }
        }
        if (!isDense) {
            this.skipNewlines();
            if (this.check(types_1.TokenType.Dedent))
                this.advance();
        }
        else {
            this.skipNewlines();
        }
        target[key] = rows;
    }
    parseValue() {
        // Quoted string
        if (this.check(types_1.TokenType.String)) {
            return this.advance().value;
        }
        // Boolean
        if (this.check(types_1.TokenType.Boolean)) {
            return this.advance().value === 'true';
        }
        // Collect all tokens until delimiter
        const parts = [];
        let hasNonNumber = false;
        while (!this.isAtEnd() && !this.isValueEnd()) {
            const token = this.advance();
            parts.push(token.value);
            if (token.type !== types_1.TokenType.Number) {
                hasNonNumber = true;
            }
        }
        if (parts.length === 0)
            return null;
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
    isValueEnd() {
        const type = this.peek().type;
        return type === types_1.TokenType.Comma ||
            type === types_1.TokenType.Semicolon ||
            type === types_1.TokenType.Newline ||
            type === types_1.TokenType.Dedent ||
            type === types_1.TokenType.EOF ||
            type === types_1.TokenType.RBrace ||
            type === types_1.TokenType.Colon;
    }
    resolveAlias(name) {
        return this.aliases.get(name) || name;
    }
    // Token helpers
    peek() {
        return this.tokens[this.pos] || { type: types_1.TokenType.EOF, value: '', line: 0, column: 0 };
    }
    advance() {
        const token = this.peek();
        if (!this.isAtEnd())
            this.pos++;
        return token;
    }
    check(type) {
        return this.peek().type === type;
    }
    isAtEnd() {
        return this.peek().type === types_1.TokenType.EOF;
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        const t = this.peek();
        throw new Error(`${message}. Got ${t.type} ('${t.value}') at line ${t.line}`);
    }
    skipNewlines() {
        while (this.check(types_1.TokenType.Newline)) {
            this.advance();
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map