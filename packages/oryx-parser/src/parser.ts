// ORYX v0.1 Parser/Encoder — Skeleton Implementation
// Language: TypeScript
// Status: Draft

/*
Core objectives:
- Parse ORYX documents into JSON-equivalent structures
- Encode JSON structures back into ORYX
- Support: aliases, blocks, tabular arrays, basic objects, dense mode
- Not full validation yet (coming in later versions)
*/

export interface OryxAliasMap {
  [key: string]: string;
}

export interface OryxParseOptions {
  strict?: boolean;
}

export class OryxParser {
  private aliasMap: OryxAliasMap = {};
  private lines: string[] = [];
  private index: number = 0;

  constructor(private input: string, private options: OryxParseOptions = {}) {
    this.lines = input.split(/\r?\n/);
  }

  parse(): any {
    const root: any = {};

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

  private parseAlias(line: string) {
    const match = line.match(/@alias\s*\{([^}]+)\}/);
    if (!match) return;
    const entries = match[1].split(',');
    entries.forEach(e => {
      const [full, alias] = e.split(':').map(s => s.trim());
      this.aliasMap[alias] = full;
    });
  }

  private parseBlock(): any {
    const header = this.current().trim();
    const match = header.match(/@block\s+(\w+):?/);
    if (!match) throw new Error("Invalid block syntax");
    const blockName = match[1];
    this.next();

    const obj: any = {};

    while (!this.eof() && this.isIndented(this.current())) {
      const [key, value] = this.parseSimpleKV(this.current().trim());
      obj[key] = value;
      this.next();
    }

    return { [blockName]: obj };
  }

  private parseKeyValue(root: any) {
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

  private parseSimpleKV(line: string): [string, any] {
    const [rawKey, rawVal] = line.split(/:(.+)/).map(s => s.trim());
    const key = this.aliasMap[rawKey] || rawKey;
    return [key, this.inferType(rawVal)];
  }

  private isTabularHeader(line: string): boolean {
    return /\w+\[\d+\]\{[^}]+\}:?/.test(line);
  }

  private extractTabularHeader(line: string) {
    const match = line.match(/(\w+)\[(\d+)\]\{([^}]+)\}/);
    if (!match) throw new Error("Invalid tabular header");
    const name = match[1];
    const count = parseInt(match[2], 10);
    const fields = match[3].split(',').map(f => f.trim()).map(f => this.aliasMap[f] || f);
    return { name, count, fields };
  }

  private extractRows(count: number, fields: string[]): any[] {
    const rows: any[] = [];

    for (let i = 0; i < count; i++) {
      const line = this.current()?.trim();
      if (!line) throw new Error("Unexpected end while reading rows");
      const cols = line.split(',').map(s => this.inferType(s.trim()));
      const rowObj: any = {};
      fields.forEach((f, idx) => rowObj[f] = cols[idx]);
      rows.push(rowObj);
      this.next();
    }
    return rows;
  }

  private inferType(v: string): any {
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
    if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
    return v;
  }

  private current() {
    return this.lines[this.index];
  }

  private next() {
    this.index++;
  }

  private eof(): boolean {
    return this.index >= this.lines.length;
  }

  private isIndented(line: string): boolean {
    return /^\s+/.test(line);
  }
}

// TODO: Add OryxEncoder class
// TODO: Add validation module
// TODO: Add error diagnostics
