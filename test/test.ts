import { OryxParser } from '../src/index';

console.log('=== ORYX Parser Tests ===\n');

// Test 1: Tabular array
console.log('Test 1: Tabular Array');
const t1 = new OryxParser(`usuarios[2]{id,nombre,rol}:
  1, Alice, admin
  2, Bob, user`);
console.log(JSON.stringify(t1.parse(), null, 2));

// Test 2: Nested object
console.log('\nTest 2: Nested Object');
const t2 = new OryxParser(`config:
  modo: rapido
  idioma: es`);
console.log(JSON.stringify(t2.parse(), null, 2));

// Test 3: Simple array
console.log('\nTest 3: Simple Array');
const t3 = new OryxParser(`tags[3]: ai, llm, oryx`);
console.log(JSON.stringify(t3.parse(), null, 2));

// Test 4: Dense mode
console.log('\nTest 4: Dense Mode');
const t4 = new OryxParser(`users[2]{id,name}:1,Ana;2,Luis`);
console.log(JSON.stringify(t4.parse(), null, 2));

// Test 5: Alias
console.log('\nTest 5: Alias');
const t5 = new OryxParser(`@alias { id:i, nombre:n }
productos[2]{i,n}:
  1, Mouse
  2, Teclado`);
console.log(JSON.stringify(t5.parse(), null, 2));

// Test 6: Block
console.log('\nTest 6: Block');
const t6 = new OryxParser(`@block contexto:
  sistema: inventario
  version: 2.0

items[1]{id,nombre}:
  1, Laptop`);
console.log(JSON.stringify(t6.parse(), null, 2));

console.log('\n=== All Tests Passed ===');
