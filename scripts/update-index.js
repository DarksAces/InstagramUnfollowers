const fs = require('fs');

const primaryIndexPath = process.argv[2];
const minifiedCodePath = process.argv[3];

const CODE_BLOCK_START = 'const instagramScript = "';
const CODE_BLOCK_END = '";//__END_OF_SCRIPT__';

const replaceRange = (s, start, end, substitute) => {
  return s.substring(0, start) + substitute + s.substring(end);
};

let minifiedCode = fs.readFileSync(minifiedCodePath, { encoding: 'utf8', flag: 'r' });

// Properly escape all special characters
minifiedCode = minifiedCode
  .replace(/\\/g, '\\\\')    // Escape backslashes first
  .replace(/"/g, '\\"')      // Escape quotes
  .replace(/\n/g, '\\n')     // Escape newlines
  .replace(/\r/g, '\\r')     // Escape carriage returns
  .replace(/\t/g, '\\t')     // Escape tabs
  .replace(/\f/g, '\\f');    // Escape form feeds

const targetPaths = [primaryIndexPath, 'index.html'].filter(p => p && fs.existsSync(p));

for (const targetPath of targetPaths) {
  const indexData = fs.readFileSync(targetPath, { encoding: 'utf8', flag: 'r' });
  const replaceStartIndex = indexData.indexOf(CODE_BLOCK_START) + CODE_BLOCK_START.length;
  const replaceEndIndex = indexData.lastIndexOf(CODE_BLOCK_END);
  if (replaceStartIndex !== -1 && replaceEndIndex !== -1) {
    const parsed = replaceRange(indexData, replaceStartIndex, replaceEndIndex, minifiedCode);
    fs.writeFileSync(targetPath, parsed);
  }
}