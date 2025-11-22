# ORYX Parser

Official parser for **ORYX v0.1** - Optimized Representation for Yielding eXpression

![Status](https://img.shields.io/badge/status-beta-yellow)
![Spec](https://img.shields.io/badge/spec-v0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 What is ORYX?

ORYX is a compact, token-efficient data format designed specifically for Large Language Models (LLMs). It combines the structure of JSON with the density of CSV and the readability of YAML.

**Key Benefits:**
- 🔥 **20-40% fewer tokens** than JSON
- 🧠 **LLM-native** design with intuitive delimiters
- 📊 **Native table support** for compact data representation
- ⚡ **Smart type inference** without excessive quoting

## 📦 Installation

```bash
npm install oryx-parser
```

## 🛠 Usage

### Parse ORYX to JSON

```typescript
import { parse } from 'oryx-parser';

const oryxData = `
products[2]{id,name,price}:
  1, Laptop, 1500
  2, Mouse, 25
`;

const json = parse(oryxData);
console.log(json);
// Output: { products: [{ id: 1, name: "Laptop", price: 1500 }, ...] }
```

### Encode JSON to ORYX

```typescript
import { encode } from 'oryx-parser';

const data = {
  user: {
    name: "Alice",
    age: 30
  }
};

const oryx = encode(data);
console.log(oryx);
// Output:
// user:
//   name: Alice
//   age: 30
```

## ✨ Features

- ✅ Parse ORYX → JSON
- ✅ Encode JSON → ORYX
- ✅ Type inference (int, float, bool, string)
- ✅ Support for aliases, blocks, tabular arrays, and nested objects
- ✅ Ultra-dense mode for maximum compression

## 📚 Documentation

- [Full Specification](https://github.com/devlewiso/oryx-format/blob/main/SPEC.md)
- [GitHub Repository](https://github.com/devlewiso/oryx-format)

## 📄 License

MIT
