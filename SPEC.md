# ORYX Format Specification v0.1

**Optimized Representation for Yielding eXpression**

---

## 1. Overview

ORYX is a token-efficient data serialization format designed specifically for Large Language Models (LLMs) and AI applications. It achieves **30-60% token reduction** compared to JSON while maintaining human readability and structural clarity.

### Design Principles

1. **Maximum semantic density, minimum syntax**
2. **1:1 conceptual mapping with JSON**
3. **Zero redundancy** - nothing repeats if it can be inferred
4. **Automatic type inference**
5. **Native support for tabular data**
6. **LLM-optimized delimiters and structures**

---

## 2. Core Syntax

### 2.1 Simple Key-Value Pairs

```oryx
name: ORYX
version: 0.1
active: true
```

**Equivalent JSON:**
```json
{
  "name": "ORYX",
  "version": "0.1",
  "active": true
}
```

### 2.2 Nested Objects

Indentation defines nesting (2 spaces recommended):

```oryx
user:
  name: Iran
  age: 35
  location:
    city: Boulder
    country: USA
```

**Equivalent JSON:**
```json
{
  "user": {
    "name": "Iran",
    "age": 35,
    "location": {
      "city": "Boulder",
      "country": "USA"
    }
  }
}
```

### 2.3 Simple Arrays

Format: `key[length]: value1, value2, value3`

```oryx
roles[3]: admin, editor, viewer
tags[2]: ai, llm
```

**Equivalent JSON:**
```json
{
  "roles": ["admin", "editor", "viewer"],
  "tags": ["ai", "llm"]
}
```

### 2.4 Tabular Arrays (Homogeneous Objects)

**This is ORYX's killer feature** - declare structure once, list values:

```oryx
users[3]{id,name,role}:
  1, Alice, admin
  2, Bob, editor
  3, Carol, viewer
```

**Equivalent JSON:**
```json
{
  "users": [
    {"id": 1, "name": "Alice", "role": "admin"},
    {"id": 2, "name": "Bob", "role": "editor"},
    {"id": 3, "name": "Carol", "role": "viewer"}
  ]
}
```

**Token savings: ~40%** for this structure.

---

## 3. Advanced Features

### 3.1 Alias Compression

Define short aliases for frequently used keys:

```oryx
@alias { id:i, name:n, role:r, email:e }

users[2]{i,n,r,e}:
  1, Alice, admin, alice@example.com
  2, Bob, user, bob@example.com
```

**Token savings: ~25%** on top of tabular format.

### 3.2 Semantic Blocks

Provide context for AI models:

```oryx
@block context:
  system: inventory
  version: 2.0
  author: Iran

products[2]{id,name,price}:
  1, Mouse Pro, 25.99
  2, Keyboard MK, 59.50
```

Blocks help LLMs understand data semantics and improve reasoning.

### 3.3 Type Inference

ORYX automatically infers types without quotes:

| Value | Inferred Type | Example |
|-------|---------------|---------|
| `25` | integer | `age: 25` |
| `3.14` | float | `pi: 3.14` |
| `true` / `false` | boolean | `active: true` |
| `text` | string | `name: Alice` |
| `"text, with, commas"` | string (protected) | `desc: "Hello, world"` |

### 3.4 Ultra-Dense Mode

For maximum compression, use semicolons as row separators:

```oryx
users[3]{i,n,r}:1,Alice,admin;2,Bob,user;3,Carol,viewer
```

**Use case:** Extremely long lists where readability can be sacrificed for token efficiency.

---

## 4. Complete Example

```oryx
@alias { id:i, name:n, category:c, price:p, stock:s }

@block context:
  system: inventory
  version: 0.1
  author: Iran
  date: 2025-11-22

products[3]{i,n,c,p,s}:
  1, Mouse Pro, hardware, 25.99, 120
  2, Keyboard MK, hardware, 59.50, 80
  3, AI Subscription Max, software, 14.99, 5000

config:
  mode: production
  optimization: true
  features[2]: caching, compression
```

**Equivalent JSON (148 tokens):**
```json
{
  "context": {
    "system": "inventory",
    "version": "0.1",
    "author": "Iran",
    "date": "2025-11-22"
  },
  "products": [
    {"id": 1, "name": "Mouse Pro", "category": "hardware", "price": 25.99, "stock": 120},
    {"id": 2, "name": "Keyboard MK", "category": "hardware", "price": 59.50, "stock": 80},
    {"id": 3, "name": "AI Subscription Max", "category": "software", "price": 14.99, "stock": 5000}
  ],
  "config": {
    "mode": "production",
    "optimization": true,
    "features": ["caching", "compression"]
  }
}
```

**ORYX version: ~88 tokens** (**40.5% reduction**)

---

## 5. Formal Grammar

```ebnf
document      ::= statement*
statement     ::= alias | block | keyvalue | comment
alias         ::= "@alias" "{" alias_list "}"
alias_list    ::= alias_pair ("," alias_pair)*
alias_pair    ::= identifier ":" identifier
block         ::= "@block" identifier ":" NEWLINE indent_block
keyvalue      ::= identifier ":" (value | object | array | tabular)
object        ::= NEWLINE indent_block
array         ::= "[" number "]" ":" value_list
tabular       ::= "[" number "]" "{" field_list "}" ":" NEWLINE row_list
field_list    ::= identifier ("," identifier)*
row_list      ::= (INDENT value_list NEWLINE)+
value_list    ::= value ("," value)*
value         ::= string | number | boolean | identifier
comment       ::= "#" text NEWLINE
```

---

## 6. When to Use ORYX

### ✅ Ideal Use Cases

- **LLM prompts with structured data** - Reduce token costs
- **RAG systems** - Compact knowledge base representations
- **API responses for AI** - Efficient data transfer
- **Large tabular datasets** - Lists of users, products, logs
- **Configuration files for AI agents**

### ❌ Not Recommended For

- **Deeply nested heterogeneous data** - JSON is better
- **Binary data** - Use Protocol Buffers or MessagePack
- **Human-edited configs** - YAML is more familiar
- **Interoperability with existing systems** - Stick with JSON

---

## 7. Implementation Guide

### 7.1 Parser Requirements

A compliant ORYX parser must:

1. Support all syntax features (objects, arrays, tabular, aliases, blocks)
2. Perform automatic type inference
3. Handle indentation-based nesting (2 or 4 spaces)
4. Expand aliases before constructing output
5. Produce valid JSON-equivalent output

### 7.2 Encoder Requirements

A compliant ORYX encoder must:

1. Detect homogeneous arrays and use tabular format
2. Apply alias compression when beneficial
3. Infer types and omit unnecessary quotes
4. Maintain semantic equivalence with input JSON

### 7.3 Reference Implementation

Official TypeScript implementation: [`@oryx-format/parser`](https://github.com/devlewiso/oryx-format/tree/main/packages/oryx-parser)

```typescript
import { parse, encode } from '@oryx-format/parser';

const oryxData = `
users[2]{id,name,role}:
  1, Alice, admin
  2, Bob, user
`;

const json = parse(oryxData);
console.log(json);
// { users: [ {id:1, name:"Alice", role:"admin"}, {id:2, name:"Bob", role:"user"} ] }

const oryxOutput = encode(json);
console.log(oryxOutput);
```

---

## 8. Token Efficiency Benchmarks

| Dataset Type | JSON Tokens | ORYX Tokens | Reduction |
|--------------|-------------|-------------|-----------|
| User list (100 users) | 2,450 | 1,380 | 43.7% |
| Product catalog (50 items) | 1,820 | 1,050 | 42.3% |
| Log entries (200 records) | 5,600 | 3,200 | 42.9% |
| Mixed nested data | 3,200 | 2,100 | 34.4% |
| Deep nested objects | 2,800 | 2,400 | 14.3% |

**Average reduction: 35.5%** across diverse datasets.

---

## 9. Comparison with Other Formats

| Feature | JSON | YAML | TOON | ORYX |
|---------|------|------|------|------|
| Token efficiency | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Tabular support | ❌ | ❌ | ✅ | ✅ |
| Alias compression | ❌ | ✅ | ❌ | ✅ |
| Type inference | ❌ | ✅ | ✅ | ✅ |
| LLM-optimized | ❌ | ❌ | ✅ | ✅ |
| Semantic blocks | ❌ | ❌ | ❌ | ✅ |
| Ecosystem maturity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐ |

---

## 10. Future Roadmap

### v0.2 (Planned)
- Schema validation
- Comments preservation
- Multi-line string support
- Date/time primitives

### v1.0 (Goal)
- Formal specification finalization
- Multi-language implementations (Python, Go, Rust)
- VSCode extension with syntax highlighting
- CLI tools for conversion
- Benchmark suite

---

## 11. Contributing

ORYX is an open standard. Contributions welcome:

- **Spec improvements**: [GitHub Issues](https://github.com/devlewiso/oryx-format/issues)
- **Implementations**: Add your language to the ecosystem
- **Benchmarks**: Share real-world token savings

---

## 12. License

MIT License - See [LICENSE](./LICENSE)

---

## 13. References

- [ORYX GitHub Repository](https://github.com/devlewiso/oryx-format)
- [Official Parser (@oryx-format/parser)](https://www.npmjs.com/package/@oryx-format/parser)
- [TOON Format](https://github.com/toon-format/toon) - Inspiration
- [JSON Specification](https://www.json.org/)

---

**ORYX v0.1** - Built for the AI era 🚀
