// ORYX v0.1 Encoder — Initial Draft
// Converts JSON -> ORYX format


export class OryxEncoder {
encode(obj: any, indent: number = 0): string {
if (Array.isArray(obj)) {
return this.encodeArray(obj, indent);
}
if (typeof obj === "object" && obj !== null) {
return this.encodeObject(obj, indent);
}
return String(obj);
}


private encodeObject(obj: any, indent: number): string {
const pad = " ".repeat(indent);
let out = "";


for (const key of Object.keys(obj)) {
const value = obj[key];
if (typeof value === "object" && !Array.isArray(value)) {
out += `${pad}${key}:\n`;
out += this.encodeObject(value, indent + 2);
} else if (Array.isArray(value)) {
out += this.encodeArrayKV(key, value, indent);
} else {
out += `${pad}${key}: ${value}\n`;
}
}
return out;
}


private encodeArrayKV(key: string, arr: any[], indent: number): string {
const pad = " ".repeat(indent);


// Detect if array is tabular
if (arr.length > 0 && typeof arr[0] === "object" && !Array.isArray(arr[0])) {
const fields = Object.keys(arr[0]);
let out = `${pad}${key}[${arr.length}]{${fields.join(",")}}:\n`;
for (const row of arr) {
const line = fields.map(f => row[f]).join(", ");
out += `${pad} ${line}\n`;
}
return out;
}


// Simple array
return `${pad}${key}[${arr.length}]: ${arr.join(",")}\n`;
}


private encodeArray(arr: any[], indent: number): string {
const pad = " ".repeat(indent);
return `${pad}- ` + arr.join(`\n${pad}- `);
}
}
