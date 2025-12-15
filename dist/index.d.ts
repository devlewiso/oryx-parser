import { OryxObject } from './types';
/**
 * ORYX Parser - Token-efficient data format for LLMs
 */
export declare class OryxParser {
    private input;
    constructor(input: string);
    /**
     * Parse ORYX format to JSON object
     */
    parse(): OryxObject;
}
/**
 * Convenience function for quick parsing
 */
export declare function parse(input: string): OryxObject;
/**
 * Encode JSON to ORYX format
 */
export declare function encode(data: OryxObject): string;
export { OryxObject, OryxValue, OryxArray } from './types';
//# sourceMappingURL=index.d.ts.map