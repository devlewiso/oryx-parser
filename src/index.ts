import { Parser } from './parser';
import { OryxObject } from './types';

/**
 * ORYX Parser - Token-efficient data format for LLMs
 */
export class OryxParser {
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Parse ORYX format to JSON object
   */
  parse(): OryxObject {
    const parser = new Parser(this.input);
    return parser.parse();
  }
}

/**
 * Convenience function for quick parsing
 */
export function parse(input: string): OryxObject {
  return new OryxParser(input).parse();
}

/**
 * Encode JSON to ORYX format
 */
export function encode(data: OryxObject): string {
  // TODO: Implement encoder
  throw new Error('Encoder not implemented yet');
}

export { OryxObject, OryxValue, OryxArray } from './types';
