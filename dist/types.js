"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Literals
    TokenType["String"] = "STRING";
    TokenType["Number"] = "NUMBER";
    TokenType["Boolean"] = "BOOLEAN";
    TokenType["Identifier"] = "IDENTIFIER";
    // Punctuation
    TokenType["Colon"] = ":";
    TokenType["Comma"] = ",";
    TokenType["Semicolon"] = ";";
    TokenType["LBracket"] = "[";
    TokenType["RBracket"] = "]";
    TokenType["LBrace"] = "{";
    TokenType["RBrace"] = "}";
    // Directives
    TokenType["AtAlias"] = "@alias";
    TokenType["AtBlock"] = "@block";
    // Structure
    TokenType["Newline"] = "NEWLINE";
    TokenType["Indent"] = "INDENT";
    TokenType["Dedent"] = "DEDENT";
    TokenType["EOF"] = "EOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
//# sourceMappingURL=types.js.map