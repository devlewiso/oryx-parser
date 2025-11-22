# ORYX

**Optimized Representation for Yielding eXpression**

![Status](https://img.shields.io/badge/status-beta-yellow)
![Spec](https://img.shields.io/badge/spec-v0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Language](https://img.shields.io/badge/TypeScript-100%25-blue)

ORYX is a compact, token-efficient data format designed specifically for Large Language Models (LLMs). It combines the structure of JSON with the density of CSV and the readability of YAML.

## 🚀 Why ORYX?

- **Token Efficiency**: Reduces token usage by 20-40% compared to JSON.
- **LLM Native**: Designed with delimiters and structures that LLMs understand intuitively.
- **Tabular Support**: Native support for compact tables, perfect for lists of objects.
- **Type Inference**: Smart type detection without excessive quoting.

## 📦 Installation

```bash
npm install oryx-parser
```

## 🛠 Usage

### Manual (Copy-Paste for LLMs)

Write ORYX directly into your prompts:

```oryx
products[2]{name,price}:
  Laptop, 1500
  Mouse, 25
```

### Programmatic (TypeScript)

```typescript
import { parse, encode } from 'oryx-parser';

// Parse ORYX to JSON
const oryxData = `
users[2]{id,name,role}:
  1, Alice, admin
  2, Bob, user
`;

const json = parse(oryxData);
console.log(json);
// Output: { users: [ {id:1, name:"Alice", role:"admin"}, {id:2, name:"Bob", role:"user"} ] }

// Encode JSON to ORYX
const data = {
  user: { name: "Alice", age: 30 }
};

const oryx = encode(data);
console.log(oryx);
// Output: user:\n  name: Alice\n  age: 30
```

## 📚 Documentation

- [Official Specification (SPEC.md)](./SPEC.md)
- [Documentation Site](./docs/index.md)

## 🗺 Roadmap

- [x] **Phase 1**: Initial Spec & Prototype
- [ ] **Phase 2**: Repository Construction & Core Packages (Current)
- [ ] **Phase 3**: Ecosystem (CLI, VSCode Extension, Multi-language support)

## 📄 License

MIT
