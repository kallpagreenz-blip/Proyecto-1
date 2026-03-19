const fs = require('fs');
const content = fs.readFileSync('tunnel2.log', 'utf16le');
console.log(content);
