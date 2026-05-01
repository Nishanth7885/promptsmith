// Fix unescaped double-quotes inside JSON string values (e.g. 5" arc-seconds).
// Usage: node scripts/fix-quotes.js <path-to-json>
const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node fix-quotes.js <file>'); process.exit(1); }
let s = fs.readFileSync(path, 'utf8');
let inStr = false, esc = false, out = '', fixed = 0;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (esc) { out += c; esc = false; continue; }
  if (c === '\\') { out += c; esc = true; continue; }
  if (c === '"') {
    if (!inStr) { inStr = true; out += c; continue; }
    // In-string quote: is it a real string terminator?
    // A real closer is followed by optional whitespace then , } ] : or newline.
    let j = i + 1;
    while (j < s.length && (s[j] === ' ' || s[j] === '\t')) j++;
    const next = s[j];
    if (next === ',' || next === '}' || next === ']' || next === ':' || next === '\n' || next === '\r') {
      inStr = false; out += c;
    } else {
      out += '\\"'; fixed++;
    }
    continue;
  }
  out += c;
}
fs.writeFileSync(path, out);
console.log('fixed', fixed, 'unescaped quotes in', path);
try { JSON.parse(out); console.log('VALID'); }
catch (e) { console.log('STILL INVALID:', e.message); process.exit(2); }
