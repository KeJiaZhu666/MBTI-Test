import fs from 'fs';

const filePath = './src/data/mbtiQuizData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find and strip bracketed prefixes from string values
// Matches: text: "【...】... " or function keys like Si: "【...】... "
// e.g. text: "【归档狂热】严格按..." -> text: "严格按..."
// We want to keep the quotes and replace only the bracket part inside.

let replaceCount = 0;

// Replace inside double/single quotes or template literals: 【...】
const cleanRegex = /(["'`])【[^】]+】([^"'`]*\1)/g;

content = content.replace(cleanRegex, (match, quote, rest) => {
  replaceCount++;
  return quote + rest;
});

console.log(`Successfully stripped ${replaceCount} bracketed jargon prefixes!`);

fs.writeFileSync(filePath, content, 'utf8');
