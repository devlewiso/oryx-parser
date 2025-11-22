// ORYX v0.1 Parser/Encoder — Skeleton Implementation
// Language: TypeScript
// Status: Draft
export class OryxParser {
    constructor(input, options = {}) {
        this.input = input;
        this.options = options;
        this.aliasMap = {};
        this.lines = [];
        this.index = 0;
        this.lines = input.split(/\r?\n/);
    }
    parse() {
        const root = {};
        while (!this.eof()) {
            const line = this.current().trim();
            if (!line || line.startsWith("#")) {
                this.next();
                continue;
            }
            if (line.startsWith("@alias")) {
                this.parseAlias(line);
                this.next();
                continue;
            }
            if (line.startsWith("@block")) {
                const block = this.parseBlock();
                Object.assign(root, block);
                continue;
            }
            // Regular key: value or structures
            this.parseKeyValue(root);
        }
        return root;
    }
    parseAlias(line) {
        const match = line.match(/@alias\s*\{([^}]+)\}/);
        if (!match)
            return;
        const entries = match[1].split(',');
        entries.forEach(e => {
            const [full, alias] = e.split(':').map(s => s.trim());
            this.aliasMap[alias] = full;
        });
    }
    parseBlock() {
        const header = this.current().trim();
        const match = header.match(/@block\s+(\w+):?/);
        if (!match)
            throw new Error("Invalid block syntax");
        const blockName = match[1];
        this.next();
        const obj = {};
        while (!this.eof() && this.isIndented(this.current())) {
            const [key, value] = this.parseSimpleKV(this.current().trim());
            obj[key] = value;
            this.next();
        }
        return { [blockName]: obj };
    }
    parseKeyValue(root) {
        const line = this.current().trim();
        // Tabular array structure: name[N]{fields}:
        if (this.isTabularHeader(line)) {
            const { name, count, fields } = this.extractTabularHeader(line);
            this.next();
            const rows = this.extractRows(count, fields);
            root[name] = rows;
            return;
        }
        // Simple KV
        if (line.includes(":")) {
            const [key, value] = this.parseSimpleKV(line);
            root[key] = value;
            this.next();
            return;
        }
        throw new Error(`Unrecognized syntax: ${line}`);
    }
    parseSimpleKV(line) {
        const [rawKey, rawVal] = line.split(/:(.+)/).map(s => s.trim());
        const key = this.aliasMap[rawKey] || rawKey;
        return [key, this.inferType(rawVal)];
    }
    isTabularHeader(line) {
        return /\w+\[\d+\]\{[^}]+\}:?/.test(line);
    }
    extractTabularHeader(line) {
        const match = line.match(/(\w+)\[(\d+)\]\{([^}]+)\}/);
        if (!match)
            throw new Error("Invalid tabular header");
        const name = match[1];
        const count = parseInt(match[2], 10);
        const fields = match[3].split(',').map(f => f.trim()).map(f => this.aliasMap[f] || f);
        return { name, count, fields };
    }
    extractRows(count, fields) {
        const rows = [];
        for (let i = 0; i < count; i++) {
            const line = this.current()?.trim();
            if (!line)
                throw new Error("Unexpected end while reading rows");
            const cols = line.split(',').map(s => this.inferType(s.trim()));
            const rowObj = {};
            fields.forEach((f, idx) => rowObj[f] = cols[idx]);
            rows.push(rowObj);
            this.next();
        }
        return rows;
    }
    inferType(v) {
        if (v === "true")
            return true;
        if (v === "false")
            return false;
        if (/^-?\d+$/.test(v))
            return parseInt(v, 10);
        if (/^-?\d*\.\d+$/.test(v))
            return parseFloat(v);
        if (v.startsWith('"') && v.endsWith('"'))
            return v.slice(1, -1);
        return v;
    }
    current() {
        return this.lines[this.index];
    }
    next() {
        this.index++;
    }
    eof() {
        return this.index >= this.lines.length;
    }
    isIndented(line) {
        return /^\s+/.test(line);
    }
}
// Convenience function for simple parsing
export function parse(input, options) {
    const parser = new OryxParser(input, options);
    return parser.parse();
}
// TODO: Add OryxEncoder class
// TODO: Add validation module
// TODO: Add error diagnostics
//# sourceMappingURL=parser.js.map