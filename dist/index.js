"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.parse = exports.OryxParser = void 0;
const parser_1 = require("./parser");
/**
 * ORYX Parser - Token-efficient data format for LLMs
 */
class OryxParser {
    constructor(input) {
        this.input = input;
    }
    /**
     * Parse ORYX format to JSON object
     */
    parse() {
        const parser = new parser_1.Parser(this.input);
        return parser.parse();
    }
}
exports.OryxParser = OryxParser;
/**
 * Convenience function for quick parsing
 */
function parse(input) {
    return new OryxParser(input).parse();
}
exports.parse = parse;
/**
 * Encode JSON to ORYX format
 */
function encode(data) {
    // TODO: Implement encoder
    throw new Error('Encoder not implemented yet');
}
exports.encode = encode;
//# sourceMappingURL=index.js.map