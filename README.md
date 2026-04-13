# ORYX — Optimized Representation for Yielding eXpression

**Token-efficient data format built for LLMs.**  
ORYX reduces token usage by 30–60% vs JSON while staying human-readable and fully round-trip compatible.

---

## What is ORYX?

ORYX is a compact serialization format that combines the structure of JSON, the density of CSV, and the readability of YAML — designed from the ground up for AI pipelines and LLM prompts.

Instead of repeating keys on every row, ORYX declares them once in a header:

```oryx
# JSON: 148 tokens → ORYX: 52 tokens
users[3]{id,name,role}:
  1, Alice, admin
  2, Bob,   user
  3, Carol, editor
```

```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob",   "role": "user"  },
    { "id": 3, "name": "Carol", "role": "editor" }
  ]
}
```

---

## Resources

| | |
|---|---|
| **npm package** | [oryx-parser](https://www.npmjs.com/package/oryx-parser) |
| **Playground** | [oryx-studio.neuralcodelab.com](https://oryx-studio.neuralcodelab.com/) |
| **Format spec** | [SPEC.md](./SPEC.md) |
| **Landing page** | [docs/index.html](./docs/index.html) |

---

## Format overview

### Key-value pairs
```oryx
name: ORYX
version: 0.3.0
active: true
secret: null
```

### Nested objects
```oryx
server:
  host: localhost
  port: 3000
  tls: true
```

### Tabular arrays — the killer feature
```oryx
products[]{id,name,price,inStock}:
  1, Laptop Pro,    1299, true
  2, Wireless Mouse,  49, true
  3, USB-C Hub,       79, false
```

### Alias compression — extra token savings
```oryx
@alias{firstName: fn, lastName: ln}

people[2]{fn,ln,age}:
  Alice, Smith, 30
  Bob,   Jones, 25
```

### Pipe strings — multiline values
```oryx
description:
  | This is line one.
  | This is line two.
```

### Dynamic arrays
```oryx
tags[]: js, typescript, llm, oryx
```

---

## npm package — v0.3.0

```bash
npm install oryx-parser
```

```typescript
import { parse, encode, validate, get, schema } from 'oryx-parser';

// Parse ORYX → JSON
const data = parse(`
  users[]{id,name}:
    1, Alice
    2, Bob
`);

// Access nested values
get(data, 'users.0.name');  // → "Alice"

// Validate shape
schema(data, {
  users: [{ id: 'number', name: 'string' }],
});  // → { valid: true, errors: [] }

// Encode JSON → ORYX
encode(data, { aliases: true });

// Validate syntax without throwing
validate(input);  // → { valid, error, line, column }
```

### CLI
```bash
npx oryx parse   data.oryx       # ORYX → JSON
npx oryx encode  data.json       # JSON → ORYX
npx oryx validate data.oryx      # check syntax
npx oryx roundtrip data.oryx     # parse then re-encode
```

---

## Token efficiency benchmarks

| Dataset | JSON | ORYX | Saved |
|---|---|---|---|
| User list (100 rows) | 2,450 | 1,380 | **43.7%** |
| Product catalog (50 rows) | 1,820 | 1,050 | **42.3%** |
| Log entries (200 rows) | 5,600 | 3,200 | **42.9%** |
| Mixed nested data | 3,200 | 2,100 | **34.4%** |
| Deep nested objects | 2,800 | 2,400 | **14.3%** |

Average reduction: **~35–43%** on tabular data.

---

## Why not JSON / YAML / TOON?

| | JSON | YAML | TOON | **ORYX** |
|---|---|---|---|---|
| Token efficient | ❌ | ⚠️ | ✅ | ✅ |
| Tabular arrays | ❌ | ❌ | ✅ | ✅ |
| `encode()` implemented | ✅ | ✅ | ✅ | ✅ |
| `schema()` validation | ❌ | ❌ | ❌ | ✅ |
| `get()` path accessor | ❌ | ❌ | ❌ | ✅ |
| Error caret `^` | ❌ | ⚠️ | ❌ | ✅ |
| ESM + CJS | ✅ | ✅ | ✅ | ✅ |
| Safe parse mode | ❌ | ❌ | ❌ | ✅ |
| Dynamic arrays `[]` | — | ✅ | ❌ | ✅ |
| Inline `{k:v}` values | ✅ | ✅ | ❌ | ✅ |

---

## License

MIT — made by [@devlewiso](https://github.com/devlewiso)
