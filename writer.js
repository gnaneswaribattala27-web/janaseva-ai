const fs = require('fs');
const path = require('path');
function writeMod(subPath, content) {
  const fullPath = path.join(__dirname, subPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created ' + subPath);
}
module.exports = { writeMod };
